begin;
create or replace function public.operator_complete_pickup(p_order_id uuid,p_received boolean)
returns void language plpgsql security definer set search_path='' as $$
declare o public.orders;
begin
 if auth.uid() is null then raise exception 'Inicia sesión.' using errcode='28000'; end if;
 if not fudi_private.is_admin() then raise exception 'Acceso de administrador requerido.' using errcode='42501'; end if;
 if p_received is distinct from true then raise exception 'Confirma que el cliente recibió el pedido.'; end if;
 select * into o from public.orders where id=p_order_id for update;
 if not found then raise exception 'Pedido no disponible.' using errcode='42501'; end if;
 if o.delivery_method<>'pickup' then raise exception 'Este paso sólo admite recogida en restaurante.'; end if;
 if o.status='delivered' then return; end if;
 if o.status<>'ready' then raise exception 'El pedido debe estar listo para recoger.'; end if;
 update public.inventory_reservations set status='consumed' where order_id=o.id and status='reserved';
 insert into public.ledger_entries(order_id,business_id,kind,amount_cents,reason)
 values(o.id,o.business_id,'platform_fee',o.platform_fee_cents,'Servicio de pedido recogido; liquidación pendiente');
 update public.orders set status='delivered',completed_at=now() where id=o.id;
 insert into fudi_private.order_events(order_id,actor_id,event_type,details)
 values(o.id,auth.uid(),'pickup_completed',jsonb_build_object('verification','operator_confirmation','platform_fee_cents',o.platform_fee_cents));
end;
$$;
revoke all on function public.operator_complete_pickup(uuid,boolean) from public,anon;
grant execute on function public.operator_complete_pickup(uuid,boolean) to authenticated;
commit;
