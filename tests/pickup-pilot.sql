begin;
do $$
declare uid uuid; bid uuid; pid uuid; oid uuid; key uuid:=gen_random_uuid(); payload jsonb; denied boolean;
begin
 select u.id into strict uid from auth.users u join fudi_private.admins a on a.user_id=u.id where lower(u.email)='miguel.e.portilla@gmail.com';
 insert into public.businesses(name,slug,status,address,latitude,longitude,accepting_orders)
 values('TEST pilot rollback','pilot-'||gen_random_uuid(),'approved','TEST address',18.61,-99.17,false) returning id into bid;
 insert into public.products(business_id,name,price_cents,track_stock,stock_units,available,option_groups)
 values(bid,'TEST',1000,true,2,true,'[]') returning id into pid;
 payload:=jsonb_build_object('business_id',bid,'items',jsonb_build_array(jsonb_build_object('product_id',pid,'quantity',1,'choices','{}'::jsonb)),
  'expected_subtotal',1000,'name','TEST','phone','+520000000000','delivery_method','pickup','address','','notes','');
 perform set_config('request.jwt.claim.sub',uid::text,true);
 denied:=false; begin perform public.create_customer_order(key,payload); exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'FAILED closed without grant'; end if;
 insert into fudi_private.pickup_pilots(customer_id,business_id,expires_at) values(uid,bid,now()+interval '1 hour');
 if not public.my_pickup_pilot(bid) then raise exception 'FAILED pilot visibility'; end if;
 perform set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
 if public.my_pickup_pilot(bid) then raise exception 'FAILED foreign visibility'; end if;
 denied:=false; begin perform public.create_customer_order(key,payload); exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'FAILED foreign user'; end if;
 perform set_config('request.jwt.claim.sub',uid::text,true);
 denied:=false; begin perform public.create_customer_order(key,payload||'{"delivery_method":"delivery","address":"TEST address"}'::jsonb); exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'FAILED delivery'; end if;
 update fudi_private.pickup_pilots set expires_at=now()-interval '1 minute' where business_id=bid;
 denied:=false; begin perform public.create_customer_order(key,payload); exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'FAILED expiry'; end if;
 update fudi_private.pickup_pilots set expires_at=now()+interval '1 hour' where business_id=bid;
 denied:=false; begin perform public.create_customer_order(key,payload||'{"expected_subtotal":1}'::jsonb); exception when raise_exception then denied:=true; end;
 if not denied or not public.my_pickup_pilot(bid) then raise exception 'FAILED invalid total consumes grant'; end if;
 oid:=public.create_customer_order(key,payload);
 if (select used_order_id from fudi_private.pickup_pilots where business_id=bid) is distinct from oid then raise exception 'FAILED grant consumption'; end if;
 if public.my_pickup_pilot(bid) then raise exception 'FAILED consumed visibility'; end if;
 if public.create_customer_order(key,payload)<>oid then raise exception 'FAILED idempotency'; end if;
 denied:=false; begin perform public.create_customer_order(gen_random_uuid(),payload); exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'FAILED second order'; end if;
 if (select count(*) from public.orders where business_id=bid)<>1 or (select stock_units from public.products where id=pid)<>1 then raise exception 'FAILED order or stock'; end if;
 if (select accepting_orders from public.businesses where id=bid) then raise exception 'FAILED general opening'; end if;
 if has_table_privilege('authenticated','fudi_private.pickup_pilots','INSERT') or has_table_privilege('authenticated','fudi_private.pickup_pilots','UPDATE') or has_table_privilege('anon','fudi_private.pickup_pilots','SELECT') then raise exception 'FAILED grants'; end if;
 if has_function_privilege('anon','public.my_pickup_pilot(uuid)','EXECUTE') then raise exception 'FAILED anon rpc'; end if;
end $$;
select 'PASS: closed store, account isolation, pickup only, expiry, validation rollback, one order, retry, inventory, permissions' as result;
rollback;
