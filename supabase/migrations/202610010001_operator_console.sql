begin;
create or replace function public.operator_access() returns boolean
language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and fudi_private.is_admin();
$$;
revoke all on function public.operator_access() from public,anon;
grant execute on function public.operator_access() to authenticated;

create or replace function public.operator_save_business(p_id uuid,p_name text,p_slug text,p_address text,p_approved boolean)
returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 if not fudi_private.is_admin() then raise exception 'Acceso exclusivo de operación.' using errcode='42501'; end if;
 if p_name is null or length(trim(p_name)) not between 1 and 160 or p_slug is null or p_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or length(p_slug)>100 or length(coalesce(p_address,''))>500 then raise exception 'Revisa nombre, identificador y dirección.'; end if;
 if p_approved and length(trim(coalesce(p_address,'')))<5 then raise exception 'Agrega la dirección antes de publicar el restaurante.'; end if;
 if p_id is null then
 insert into public.businesses(name,slug,address,status,accepting_orders) values(trim(p_name),p_slug,nullif(trim(p_address),''),case when p_approved then 'approved' else 'pending' end,false) returning id into result;
 else
 update public.businesses set name=trim(p_name),slug=p_slug,address=nullif(trim(p_address),''),status=case when p_approved then 'approved' else 'pending' end,accepting_orders=false where id=p_id returning id into result;
 if result is null then raise exception 'Restaurante no encontrado.'; end if;
 end if;
 return result;
end $$;

create or replace function public.operator_save_driver(p_id uuid,p_name text,p_phone text,p_business_id uuid,p_shared boolean,p_approved boolean)
returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 if not fudi_private.is_admin() then raise exception 'Acceso exclusivo de operación.' using errcode='42501'; end if;
 if p_name is null or length(trim(p_name)) not between 1 and 120 or p_phone is null or p_phone !~ '^\+52[0-9]{10}$' then raise exception 'Revisa el nombre y teléfono de 10 dígitos.'; end if;
 if not coalesce(p_shared,false) and p_business_id is null then raise exception 'Selecciona restaurante o repa compartido.'; end if;
 perform pg_advisory_xact_lock(hashtextextended(p_phone,42));
 if exists(select 1 from public.drivers where phone=p_phone and id is distinct from p_id) then raise exception 'Ese teléfono ya está registrado.'; end if;
 if p_id is null then
 insert into public.drivers(display_name,phone,business_id,shared,approved) values(trim(p_name),p_phone,p_business_id,p_shared,p_approved) returning id into result;
 else
 update public.drivers set display_name=trim(p_name),phone=p_phone,business_id=p_business_id,shared=p_shared,approved=p_approved where id=p_id returning id into result;
 if result is null then raise exception 'Repa no encontrado.'; end if;
 end if;
 return result;
end $$;

create or replace function public.operator_save_product(p_id uuid,p_business_id uuid,p_name text,p_description text,p_price_cents integer,p_category text,p_available boolean)
returns uuid language plpgsql security definer set search_path='' as $$
declare result uuid;
begin
 if not fudi_private.is_admin() then raise exception 'Acceso exclusivo de operación.' using errcode='42501'; end if;
 if p_name is null or length(trim(p_name)) not between 1 and 160 or p_price_cents is null or p_price_cents<0 or length(coalesce(p_description,''))>2000 or length(coalesce(p_category,'')) not between 1 and 100 then raise exception 'Revisa producto, categoría y precio.'; end if;
 if p_id is null then
 insert into public.products(business_id,name,description,price_cents,category,available) values(p_business_id,trim(p_name),coalesce(p_description,''),p_price_cents,p_category,p_available) returning id into result;
 else
 update public.products set name=trim(p_name),description=coalesce(p_description,''),price_cents=p_price_cents,category=p_category,available=p_available where id=p_id and business_id=p_business_id returning id into result;
 if result is null then raise exception 'Producto no encontrado en ese restaurante.'; end if;
 end if;
 return result;
end $$;
revoke all on function public.operator_save_business(uuid,text,text,text,boolean),public.operator_save_driver(uuid,text,text,uuid,boolean,boolean),public.operator_save_product(uuid,uuid,text,text,integer,text,boolean) from public,anon;
grant execute on function public.operator_save_business(uuid,text,text,text,boolean),public.operator_save_driver(uuid,text,text,uuid,boolean,boolean),public.operator_save_product(uuid,uuid,text,text,integer,text,boolean) to authenticated;
create or replace function public.confirm_business_order(p_order_id uuid,p_minutes integer)
returns void language plpgsql security definer set search_path='' as $$
declare o public.orders;
begin
 if auth.uid() is null then raise exception 'Inicia sesión.' using errcode='28000'; end if;
 select * into o from public.orders where id=p_order_id for update;
 if not found or not fudi_private.is_admin() then raise exception 'No tienes acceso a este pedido.' using errcode='42501'; end if;
 if p_minutes is null or p_minutes not between 1 and 240 then raise exception 'Indica entre 1 y 240 minutos.'; end if;
 if o.status in ('awaiting_quote','preparing') and o.preparation_minutes=p_minutes then return; end if;
 if o.status<>'requested' then raise exception 'El pedido ya cambió de estado.'; end if;
 update public.orders set status=case when delivery_method='pickup' then 'preparing' else 'awaiting_quote' end,preparation_minutes=p_minutes where id=o.id;
 insert into fudi_private.order_events(order_id,actor_id,event_type,details) values(o.id,auth.uid(),'business_confirmed',jsonb_build_object('minutes',p_minutes));
end;
$$;
revoke all on function public.confirm_business_order(uuid,integer) from public,anon;
grant execute on function public.confirm_business_order(uuid,integer) to authenticated;

create or replace function public.cancel_pending_order(p_order_id uuid)
returns void language plpgsql security definer set search_path='' as $$
declare o public.orders; reservation public.inventory_reservations;
begin
 if auth.uid() is null then raise exception 'Inicia sesión.' using errcode='28000'; end if;
 select * into o from public.orders where id=p_order_id for update;
 if not found or (o.customer_id<>auth.uid() and not fudi_private.is_admin()) then raise exception 'No tienes acceso a este pedido.' using errcode='42501'; end if;
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

create or replace function public.set_product_availability(p_product_id uuid,p_available boolean)
returns void language plpgsql security definer set search_path='' as $$
declare bid uuid;
begin
 if auth.uid() is null then raise exception 'Inicia sesión.' using errcode='28000'; end if;
 select business_id into bid from public.products where id=p_product_id;
 if bid is null or not fudi_private.is_admin() then
  raise exception 'No tienes acceso a este negocio.' using errcode='42501';
 end if;
 if p_available is null then raise exception 'Disponibilidad inválida.'; end if;
 update public.products set available=p_available where id=p_product_id;
end;
$$;
revoke all on function public.set_product_availability(uuid,boolean) from public,anon;
grant execute on function public.set_product_availability(uuid,boolean) to authenticated;


create or replace function fudi_private.can_read_order(oid uuid) returns boolean
 language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.orders o where o.id=oid and (o.customer_id=auth.uid() or fudi_private.is_admin()));
$$;
drop policy drivers_read on public.drivers;
create policy drivers_read on public.drivers for select to authenticated using(fudi_private.is_admin());
drop policy ledger_read on public.ledger_entries;
create policy ledger_read on public.ledger_entries for select to authenticated using(fudi_private.is_admin());
drop policy settlements_read on public.settlements;
create policy settlements_read on public.settlements for select to authenticated using(fudi_private.is_admin());
commit;


