begin;
do $$
declare uid uuid; bid uuid; oid uuid; n integer; denied boolean;
begin
 select u.id into strict uid from auth.users u join fudi_private.admins a on a.user_id=u.id where lower(u.email)='miguel.e.portilla@gmail.com';
 insert into public.businesses(name,slug,status) values('TEST ready rollback','ready-'||gen_random_uuid(),'pending') returning id into bid;
 insert into public.orders(customer_id,business_id,request_key,delivery_method,customer_name,customer_phone,pickup_address,subtotal_cents,shipping_cents)
 values(uid,bid,gen_random_uuid(),'pickup','TEST','+520000000000','TEST',1000,0) returning id into oid;
 perform set_config('request.jwt.claim.sub',uid::text,true);
 denied:=false; begin perform public.operator_mark_pickup_ready(oid); exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'FAILED skipped preparation'; end if;
 update public.orders set status='preparing' where id=oid;
 perform set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
 denied:=false; begin perform public.operator_mark_pickup_ready(oid); exception when insufficient_privilege then denied:=true; end;
 if not denied then raise exception 'FAILED nonadmin'; end if;
 perform set_config('request.jwt.claim.sub',uid::text,true);
 perform public.operator_mark_pickup_ready(oid);
 perform public.operator_mark_pickup_ready(oid);
 select count(*) into n from fudi_private.order_events where order_id=oid and event_type='pickup_ready';
 if n<>1 or (select status from public.orders where id=oid)<>'ready' then raise exception 'FAILED ready/idempotency'; end if;
 if (select completed_at from public.orders where id=oid) is not null then raise exception 'FAILED completed too early'; end if;
 update public.orders set status='cancelled' where id=oid;
 denied:=false; begin perform public.operator_mark_pickup_ready(oid); exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'FAILED cancelled'; end if;
 update public.orders set delivery_method='delivery',delivery_address='TEST',status='requested' where id=oid;
 denied:=false; begin perform public.operator_mark_pickup_ready(oid); exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'FAILED delivery'; end if;
 if has_function_privilege('anon','public.operator_mark_pickup_ready(uuid)','EXECUTE') then raise exception 'FAILED anon grant'; end if;
end $$;
select 'PASS: ready, retry, audit, nonadmin, invalid states, pickup only, no completion, anon denied' as result;
rollback;
