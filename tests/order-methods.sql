begin;
do $$
declare uid uuid:='00000000-0000-4000-8000-000000000001'; bid uuid; pid uuid; oid uuid; payload jsonb; denied boolean;
begin
 -- This script is intended only for an isolated database with the authorized fixture account.
 select id into strict uid from auth.users where lower(email)='miguel.e.portilla@gmail.com';
 insert into public.businesses(name,slug,status,address,latitude,longitude,accepting_orders)
 values('TEST methods','methods-'||gen_random_uuid(),'approved','TEST pickup address',18,-99,true) returning id into bid;
 if (select pickup_enabled and not delivery_enabled from public.businesses where id=bid) is distinct from true then raise exception 'FAILED safe defaults'; end if;
 insert into public.products(business_id,name,price_cents,available,track_stock,stock_units,option_groups)
 values(bid,'TEST',1000,true,true,5,'[]') returning id into pid;
 payload:=jsonb_build_object('business_id',bid,'name','TEST','phone','+520000000000','delivery_method','pickup','expected_subtotal',1000,'items',jsonb_build_array(jsonb_build_object('product_id',pid,'quantity',1,'choices','{}'::jsonb)));
 perform set_config('request.jwt.claim.sub',uid::text,true);
 oid:=public.create_customer_order(gen_random_uuid(),payload);
 if (select status from public.orders where id=oid)<>'requested' then raise exception 'FAILED ordinary pickup'; end if;
 insert into fudi_private.coordinators(user_id,slot,phone,active) values(uid,'principal','+520000000000',true);
 denied:=false;
 begin perform public.create_customer_order(gen_random_uuid(),payload||'{"delivery_method":"delivery","address":"TEST delivery address"}'::jsonb);
 exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'FAILED disabled delivery allowed with coordinator'; end if;
 update public.businesses set pickup_enabled=false where id=bid;
 denied:=false; begin perform public.create_customer_order(gen_random_uuid(),payload); exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'FAILED disabled pickup allowed'; end if;
 update public.businesses set accepting_orders=false where id=bid;
 insert into fudi_private.pickup_pilots(customer_id,business_id,expires_at) values(uid,bid,now()+interval '1 hour');
 if public.my_pickup_pilot(bid) then raise exception 'FAILED disabled pilot advertised'; end if;
 denied:=false; begin perform public.create_customer_order(gen_random_uuid(),payload); exception when raise_exception then denied:=true; end;
 if not denied then raise exception 'FAILED disabled pickup pilot allowed'; end if;
 update public.businesses set pickup_enabled=true where id=bid;
 if not public.my_pickup_pilot(bid) then raise exception 'FAILED enabled pilot hidden'; end if;
 oid:=public.create_customer_order(gen_random_uuid(),payload);
 if public.my_pickup_pilot(bid) then raise exception 'FAILED consumed pilot advertised'; end if;
 -- A method change never invalidates a retry of an already accepted order.
 update public.businesses set pickup_enabled=false where id=bid;
 if public.create_customer_order((select request_key from public.orders where id=oid),payload)<>oid then raise exception 'FAILED retry after method closure'; end if;
 if (select stock_units from public.products where id=pid)<>3 then raise exception 'FAILED rejected requests reserved stock'; end if;
 if has_table_privilege('authenticated','public.businesses','UPDATE') or has_table_privilege('anon','public.businesses','UPDATE') then raise exception 'FAILED public method writes'; end if;
 if has_function_privilege('anon','public.create_customer_order(uuid,jsonb)','EXECUTE') then raise exception 'FAILED anonymous execute'; end if;
end $$;
rollback;
