begin;
create or replace function public.operator_mark_pickup_ready(p_order_id uuid)
returns void language plpgsql security definer set search_path='' as $$
declare o public.orders;
begin
 if auth.uid() is null then raise exception 'Inicia sesión.' using errcode='28000'; end if;
 if not fudi_private.is_admin() then raise exception 'Acceso de administrador requerido.' using errcode='42501'; end if;
 select * into o from public.orders where id=p_order_id for update;
 if not found then raise exception 'Pedido no disponible.' using errcode='42501'; end if;
 if o.delivery_method<>'pickup' then raise exception 'Este paso sólo admite pedidos para recoger.'; end if;
 if o.status='ready' then return; end if;
 if o.status<>'preparing' then raise exception 'Sólo puedes marcar listo un pedido en preparación.'; end if;
 update public.orders set status='ready' where id=o.id;
 insert into fudi_private.order_events(order_id,actor_id,event_type)
 values(o.id,auth.uid(),'pickup_ready');
end;
$$;
revoke all on function public.operator_mark_pickup_ready(uuid) from public,anon;
grant execute on function public.operator_mark_pickup_ready(uuid) to authenticated;
commit;
