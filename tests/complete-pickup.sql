begin;
do $$
declare uid uuid; bid uuid; pid uuid; oid uuid; denied boolean; stamp timestamptz; stage text;
begin
 select u.id into strict uid from auth.users u join fudi_private.admins a on a.user_id=u.id where lower(u.email)='miguel.e.portilla@gmail.com';
 insert into public.businesses(name,slug,status) values('TEST closure rollback','closure-'||gen_random_uuid(),'pending') returning id into bid;
 insert into public.products(business_id,name,price_cents,track_stock,stock_units) values(bid,'TEST',1000,true,2) returning id into pid;
 insert into public.orders(customer_id,business_id,request_key,delivery_method,customer_name,customer_phone,pickup_address,subtotal_cents,shipping_cents)
 values(uid,bid,gen_random_uuid(),'pickup','TEST','+520000000000','TEST',1000,0) returning id into oid;
 insert into public.order_items(order_id,business_id,product_id,product_name,unit_price_cents,quantity) values(oid,bid,pid,'TEST',1000,1);
 insert into public.inventory_reservations(order_id,product_id,quantity) values(oid,pid,1);
 perform set_config('request.jwt.claim.sub',uid::text,true);
 foreach stage in array array['requested','preparing','cancelled'] loop
  update public.orders set status=stage where id=oid;
  denied:=false; begin perform public.operator_complete_pickup(oid,true); exception when raise_exception then denied:=true; end;
  if not denied then raise exception 'FAILED invalid state %',stage; end if;
 end loop;
 update public.orders set status='ready' where id=oid;
 denied:=false; begin perform public.operator_complete_pickup(oid,false); exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'FAILED missing confirmation'; end if;
 denied:=false; begin perform public.operator_complete_pickup(oid,null); exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'FAILED null confirmation'; end if;
 perform set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
 denied:=false; begin perform public.operator_complete_pickup(oid,true); exception when insufficient_privilege then denied:=true; end;
 if not denied then raise exception 'FAILED nonadmin'; end if;
 if exists(select 1 from public.ledger_entries where order_id=oid) then raise exception 'FAILED premature charge'; end if;
 perform set_config('request.jwt.claim.sub',uid::text,true);
 perform public.operator_complete_pickup(oid,true);
 select completed_at into stamp from public.orders where id=oid and status='delivered';
 if stamp is null then raise exception 'FAILED completion'; end if;
 perform public.operator_complete_pickup(oid,true);
 if (select count(*) from public.ledger_entries where order_id=oid and kind='platform_fee' and amount_cents=1000)<>1 then raise exception 'FAILED fee'; end if;
 if (select count(*) from fudi_private.order_events where order_id=oid and event_type='pickup_completed' and actor_id=uid)<>1 then raise exception 'FAILED event'; end if;
 if (select status from public.inventory_reservations where order_id=oid and product_id=pid)<>'consumed' or (select stock_units from public.products where id=pid)<>2 then raise exception 'FAILED inventory'; end if;
 if (select completed_at from public.orders where id=oid)<>stamp then raise exception 'FAILED retry timestamp'; end if;
 if exists(select 1 from public.settlements where business_id=bid) then raise exception 'FAILED fabricated settlement'; end if;
 update public.orders set delivery_method='delivery',delivery_address='TEST',status='requested',completed_at=null where id=oid;
 denied:=false; begin perform public.operator_complete_pickup(oid,true); exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'FAILED delivery'; end if;
 if has_function_privilege('anon','public.operator_complete_pickup(uuid,boolean)','EXECUTE') then raise exception 'FAILED anon grant'; end if;
end $$;
select 'PASS: completion, confirmation, permissions, states, retry, single fee/event, inventory, no settlement, pickup only' as result;
rollback;
