begin;
create function public.create_customer_order(p_request_key uuid,p_payload jsonb)
returns uuid language plpgsql security definer set search_path='' as $$
declare
 uid uuid := auth.uid(); existing public.orders; b public.businesses; prod public.products;
 item jsonb; grp jsonb; choice text; subtotal bigint:=0; qty integer; line_count integer;
 order_id uuid; coordinator uuid; request_bid uuid;
begin
 if uid is null then raise exception 'Inicia sesión para solicitar tu pedido.' using errcode='28000'; end if;
 if p_request_key is null or p_payload is null or jsonb_typeof(p_payload)<>'object' or octet_length(p_payload::text)>30000 then
  raise exception 'Solicitud inválida.' using errcode='22023';
 end if;
 perform pg_advisory_xact_lock(hashtextextended(uid::text || ':' || p_request_key::text,0));
 select * into existing from public.orders where customer_id=uid and request_key=p_request_key;
 if found then
  if existing.request_payload is distinct from p_payload then raise exception 'Esta solicitud ya fue usada para otro pedido.'; end if;
  return existing.id;
 end if;
 if jsonb_typeof(p_payload->'items') is distinct from 'array' then raise exception 'Elige productos.'; end if;
 line_count:=jsonb_array_length(p_payload->'items');
 if line_count<1 or line_count>50 then raise exception 'Elige entre 1 y 50 renglones.'; end if;
 if length(trim(coalesce(p_payload->>'name',''))) not between 1 and 80
 or coalesce(p_payload->>'phone','') !~ '^\+?[0-9 ()-]{10,20}$'
 or coalesce(p_payload->>'delivery_method','') not in ('pickup','delivery')
 or length(coalesce(p_payload->>'notes',''))>500 then raise exception 'Revisa tus datos de contacto.'; end if;
 if p_payload->>'delivery_method'='delivery' and length(trim(coalesce(p_payload->>'address',''))) not between 5 and 500 then
  raise exception 'Escribe la dirección de entrega.'; end if;
 request_bid := (p_payload->>'business_id')::uuid;
 select * into b from public.businesses where id=request_bid for share;
 if not found or b.status<>'approved' or not b.accepting_orders then raise exception 'El negocio todavía no recibe pedidos en fudiBOX.'; end if;
 if b.address is null or b.latitude is null or b.longitude is null then raise exception 'Falta configurar el punto de recogida.'; end if;
 if p_payload->>'delivery_method'='delivery' then
  select user_id into coordinator from fudi_private.coordinators where slot='principal' and active;
  if coordinator is null then raise exception 'El reparto aún no está disponible.'; end if;
 end if;
 -- Lock every affected product in the same order to avoid cross-cart deadlocks.
 perform id from public.products where id in (select (v->>'product_id')::uuid from jsonb_array_elements(p_payload->'items') v) order by id for update;
 for item in select value from jsonb_array_elements(p_payload->'items') loop
  if jsonb_typeof(item->'quantity') is distinct from 'number' or (item->>'quantity') !~ '^[0-9]+$' then raise exception 'Cantidad inválida.'; end if;
  qty:=(item->>'quantity')::integer;
  if qty not between 1 and 20 then raise exception 'Cantidad inválida.'; end if;
  select * into prod from public.products where id=(item->>'product_id')::uuid;
  if not found or prod.business_id<>b.id or not prod.available then raise exception 'Un producto ya no está disponible.'; end if;
  if jsonb_typeof(item->'choices') is distinct from 'object' then raise exception 'Faltan las opciones del paquete.'; end if;
  if (select count(*) from jsonb_object_keys(item->'choices'))<>jsonb_array_length(prod.option_groups) then raise exception 'Revisa las opciones del paquete.'; end if;
  for grp in select value from jsonb_array_elements(prod.option_groups) loop
   choice:=item->'choices'->>(grp->>'name');
   if choice is null or not (grp->'choices' ? choice) then raise exception 'Elige todas las opciones del paquete.'; end if;
  end loop;
  subtotal:=subtotal+prod.price_cents::bigint*qty;
 end loop;
 if subtotal>2147483647 or coalesce(p_payload->>'expected_subtotal','') !~ '^[0-9]+$'
 or (p_payload->>'expected_subtotal')::bigint<>subtotal then raise exception 'El menú cambió. Recarga y revisa el total antes de confirmar.'; end if;
 for prod in select * from public.products where id in (select (v->>'product_id')::uuid from jsonb_array_elements(p_payload->'items') v) order by id loop
  select sum((v->>'quantity')::integer) into qty from jsonb_array_elements(p_payload->'items') v where (v->>'product_id')::uuid=prod.id;
  if qty>20 then raise exception 'Máximo 20 unidades por producto.'; end if;
  if prod.track_stock and prod.stock_units<qty then raise exception 'No hay suficientes existencias.'; end if;
 end loop;
 insert into public.orders(customer_id,business_id,request_key,delivery_method,customer_name,customer_phone,delivery_address,pickup_address,notes,subtotal_cents,shipping_cents,coordinator_id,request_payload)
 values(uid,b.id,p_request_key,p_payload->>'delivery_method',trim(p_payload->>'name'),p_payload->>'phone',
 case when p_payload->>'delivery_method'='delivery' then trim(p_payload->>'address') end,b.address,
 coalesce(p_payload->>'notes',''),subtotal::integer,case when p_payload->>'delivery_method'='pickup' then 0 end,coordinator,p_payload)
 returning id into order_id;
 for prod in select * from public.products where id in (select (v->>'product_id')::uuid from jsonb_array_elements(p_payload->'items') v) order by id loop
  select sum((v->>'quantity')::integer) into qty from jsonb_array_elements(p_payload->'items') v where (v->>'product_id')::uuid=prod.id;
  insert into public.order_items(order_id,business_id,product_id,product_name,unit_price_cents,quantity,selections)
  select order_id,b.id,prod.id,prod.name,prod.price_cents,qty,
   jsonb_agg(jsonb_build_object('quantity',(v->>'quantity')::integer,'choices',v->'choices'))
  from jsonb_array_elements(p_payload->'items') v where (v->>'product_id')::uuid=prod.id;
  if prod.track_stock then
   update public.products set stock_units=stock_units-qty where id=prod.id;
   insert into public.inventory_reservations(order_id,product_id,quantity) values(order_id,prod.id,qty);
  end if;
 end loop;
 insert into fudi_private.order_events(order_id,actor_id,event_type) values(order_id,uid,'requested');
 return order_id;
end;
$$;
revoke all on function public.create_customer_order(uuid,jsonb) from public,anon;
grant execute on function public.create_customer_order(uuid,jsonb) to authenticated;

create function public.confirm_business_order(p_order_id uuid,p_minutes integer)
returns void language plpgsql security definer set search_path='' as $$
declare o public.orders;
begin
 if auth.uid() is null then raise exception 'Inicia sesión.' using errcode='28000'; end if;
 select * into o from public.orders where id=p_order_id for update;
 if not found or not fudi_private.is_business_member(o.business_id) then raise exception 'No tienes acceso a este pedido.' using errcode='42501'; end if;
 if p_minutes is null or p_minutes not between 1 and 240 then raise exception 'Indica entre 1 y 240 minutos.'; end if;
 if o.status in ('awaiting_quote','preparing') and o.preparation_minutes=p_minutes then return; end if;
 if o.status<>'requested' then raise exception 'El pedido ya cambió de estado.'; end if;
 update public.orders set status=case when delivery_method='pickup' then 'preparing' else 'awaiting_quote' end,preparation_minutes=p_minutes where id=o.id;
 insert into fudi_private.order_events(order_id,actor_id,event_type,details) values(o.id,auth.uid(),'business_confirmed',jsonb_build_object('minutes',p_minutes));
end;
$$;
revoke all on function public.confirm_business_order(uuid,integer) from public,anon;
grant execute on function public.confirm_business_order(uuid,integer) to authenticated;

create function public.cancel_pending_order(p_order_id uuid)
returns void language plpgsql security definer set search_path='' as $$
declare o public.orders; reservation public.inventory_reservations;
begin
 if auth.uid() is null then raise exception 'Inicia sesión.' using errcode='28000'; end if;
 select * into o from public.orders where id=p_order_id for update;
 if not found or (o.customer_id<>auth.uid() and not fudi_private.is_business_member(o.business_id)) then raise exception 'No tienes acceso a este pedido.' using errcode='42501'; end if;
 if o.status='cancelled' then return; end if;
 if o.status not in ('requested','awaiting_quote','quoted') then raise exception 'El pedido ya está en preparación. Contacta al negocio.'; end if;
 for reservation in select * from public.inventory_reservations where order_id=o.id and status='reserved' order by product_id for update loop
  update public.products set stock_units=stock_units+reservation.quantity where id=reservation.product_id;
  update public.inventory_reservations set status='released' where order_id=o.id and product_id=reservation.product_id;
 end loop;
 update public.orders set status='cancelled' where id=o.id;
 insert into fudi_private.order_events(order_id,actor_id,event_type) values(o.id,auth.uid(),'cancelled');
end;
$$;
revoke all on function public.cancel_pending_order(uuid) from public,anon;
grant execute on function public.cancel_pending_order(uuid) to authenticated;
commit;