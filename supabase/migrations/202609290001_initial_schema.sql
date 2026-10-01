-- FudiBOX · 01: estructura y lectura protegida. Proyecto nuevo exclusivo.
-- Ejecutar UNA vez como postgres en SQL Editor. No borra datos.
-- No habilita aún operaciones de pedidos: requieren RPC transaccionales posteriores.
begin;
create schema if not exists fudi_private;
revoke all on schema fudi_private from public, anon, authenticated;
grant usage on schema fudi_private to authenticated;

create table fudi_private.admins (
 user_id uuid primary key references auth.users(id),
 created_at timestamptz not null default now()
);
create table public.profiles (
 id uuid primary key references auth.users(id),
 display_name text not null check (length(trim(display_name)) between 1 and 120),
 phone text,
 created_at timestamptz not null default now()
);
create table public.businesses (
 id uuid primary key default gen_random_uuid(),
 name text not null check (length(trim(name)) between 1 and 160),
 slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
 status text not null default 'pending' check (status in ('pending','approved','suspended')),
 address text,
 latitude numeric(10,7) check (latitude between -90 and 90),
 longitude numeric(10,7) check (longitude between -180 and 180),
 logo_path text,
 accepting_orders boolean not null default false,
 created_at timestamptz not null default now(),
 check ((latitude is null) = (longitude is null)),
 check (not accepting_orders or (status='approved' and address is not null and latitude is not null))
);
create table fudi_private.business_members (
 business_id uuid not null references public.businesses(id),
 user_id uuid not null references auth.users(id),
 role text not null check (role in ('owner','staff')),
 active boolean not null default true,
 primary key (business_id,user_id)
);
create index business_members_user on fudi_private.business_members(user_id);
create table fudi_private.coordinators (
 user_id uuid primary key references auth.users(id),
 slot text not null unique check (slot in ('principal','backup')),
 phone text not null,
 active boolean not null default false
);
create table public.products (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.businesses(id),
 name text not null check (length(trim(name)) between 1 and 160),
 description text not null default '',
 price_cents integer not null check (price_cents >= 0),
 image_path text,
 available boolean not null default false,
 track_stock boolean not null default false,
 stock_units integer not null default 0 check (stock_units >= 0),
 created_at timestamptz not null default now(),
 unique(id,business_id)
);
create index products_business on public.products(business_id);
create table public.drivers (
 id uuid primary key default gen_random_uuid(),
 display_name text not null,
 phone text not null,
 business_id uuid references public.businesses(id),
 shared boolean not null default false,
 approved boolean not null default false,
 created_at timestamptz not null default now()
);
create table public.orders (
 id uuid primary key default gen_random_uuid(),
 customer_id uuid not null references auth.users(id),
 business_id uuid not null references public.businesses(id),
 request_key uuid not null,
 delivery_method text not null check (delivery_method in ('delivery','pickup')),
 status text not null default 'requested' check (status in ('requested','awaiting_quote','quoted','preparing','ready','delivered','expired','cancelled')),
 customer_name text not null,
 customer_phone text not null,
 delivery_address text,
 delivery_latitude numeric(10,7) check (delivery_latitude between -90 and 90),
 delivery_longitude numeric(10,7) check (delivery_longitude between -180 and 180),
 pickup_address text not null,
 notes text not null default '',
 subtotal_cents integer not null check (subtotal_cents >= 0),
 platform_fee_cents integer not null default 1000 check (platform_fee_cents=1000),
 shipping_cents integer check (shipping_cents >= 0),
 total_cents bigint generated always as (subtotal_cents::bigint+platform_fee_cents+shipping_cents) stored,
 coordinator_id uuid references fudi_private.coordinators(user_id),
 driver_id uuid references public.drivers(id),
 preparation_minutes integer check (preparation_minutes between 1 and 240),
 quoted_at timestamptz,
 quote_expires_at timestamptz,
 quote_accepted_at timestamptz,
 completed_at timestamptz,
 created_at timestamptz not null default now(),
 unique(customer_id,request_key),
 unique(id,business_id),
 check ((delivery_latitude is null)=(delivery_longitude is null)),
 check (delivery_method<>'delivery' or (delivery_address is not null and length(trim(delivery_address))>0)),
 check (delivery_method<>'pickup' or (shipping_cents=0 and shipping_cents is not null and coordinator_id is null and driver_id is null)),
 check ((quoted_at is null and quote_expires_at is null) or (quoted_at is not null and quote_expires_at is not null and quote_expires_at=quoted_at+interval '10 minutes')),
 check (status<>'quoted' or (delivery_method='delivery' and quoted_at is not null and quote_expires_at is not null and shipping_cents is not null)),
 check (quote_accepted_at is null or (quoted_at is not null and quote_expires_at is not null and quote_accepted_at>=quoted_at and quote_accepted_at<quote_expires_at)),
 check (delivery_method<>'delivery' or status not in ('preparing','ready','delivered') or (quote_accepted_at is not null and shipping_cents is not null)),
 check (status<>'delivered' or completed_at is not null)
);
create index orders_customer on public.orders(customer_id,created_at desc);
create index orders_business on public.orders(business_id,status);
create index orders_coordinator on public.orders(coordinator_id,status);
create index orders_expiry on public.orders(quote_expires_at) where status='quoted';
create unique index driver_one_active_order on public.orders(driver_id)
 where driver_id is not null and status not in ('delivered','expired','cancelled');
create table public.order_items (
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null,
 business_id uuid not null,
 product_id uuid not null,
 product_name text not null,
 unit_price_cents integer not null check (unit_price_cents>=0),
 quantity integer not null check (quantity between 1 and 1000),
 line_total_cents bigint generated always as (unit_price_cents::bigint*quantity) stored,
 foreign key (order_id,business_id) references public.orders(id,business_id),
 foreign key (product_id,business_id) references public.products(id,business_id),
 unique(order_id,product_id)
);
create table public.inventory_reservations (
 order_id uuid not null,
 product_id uuid not null,
 quantity integer not null check (quantity>0),
 status text not null default 'reserved' check(status in ('reserved','consumed','released')),
 created_at timestamptz not null default now(),
 primary key(order_id,product_id),
 foreign key(order_id,product_id) references public.order_items(order_id,product_id)
);
-- Códigos y eventos internos nunca se exponen a cliente ni coordinador.
create table fudi_private.delivery_codes (
 order_id uuid primary key references public.orders(id),
 code_hash text not null,
 failed_attempts integer not null default 0 check(failed_attempts between 0 and 5),
 verified_at timestamptz
);
create table fudi_private.order_events (
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null references public.orders(id),
 actor_id uuid references auth.users(id),
 event_type text not null,
 details jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
create index order_events_order on fudi_private.order_events(order_id,created_at);
create table public.ledger_entries (
 id uuid primary key default gen_random_uuid(),
 order_id uuid not null,
 business_id uuid not null,
 kind text not null check(kind in ('platform_fee','reversal')),
 amount_cents integer not null,
 reason text not null,
 created_at timestamptz not null default now(),
 foreign key(order_id,business_id) references public.orders(id,business_id),
 unique(order_id,kind),
 check ((kind='platform_fee' and amount_cents=1000) or (kind='reversal' and amount_cents=-1000))
);
create index ledger_business on public.ledger_entries(business_id,created_at);
create table public.settlements (
 id uuid primary key default gen_random_uuid(),
 business_id uuid not null references public.businesses(id),
 amount_cents integer not null check(amount_cents>0),
 reference text not null,
 recorded_by uuid not null references auth.users(id),
 paid_at timestamptz not null,
 created_at timestamptz not null default now(),
 unique(business_id,reference)
);
create index settlements_business on public.settlements(business_id,paid_at);

-- Ayudantes de lectura con identidad del JWT, jamás con un rol elegido en pantalla.
create function fudi_private.is_admin() returns boolean
 language sql stable security definer set search_path='' as $$
 select exists(select 1 from fudi_private.admins a where a.user_id=(select auth.uid()));
$$;
create function fudi_private.is_business_member(bid uuid) returns boolean
 language sql stable security definer set search_path='' as $$
 select exists(select 1 from fudi_private.business_members m where m.business_id=bid and m.user_id=(select auth.uid()) and m.active);
$$;
create function fudi_private.is_coordinator() returns boolean
 language sql stable security definer set search_path='' as $$
 select exists(select 1 from fudi_private.coordinators c where c.user_id=(select auth.uid()) and c.active);
$$;
create function fudi_private.can_read_order(oid uuid) returns boolean
 language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.orders o where o.id=oid and
 (o.customer_id=(select auth.uid()) or fudi_private.is_admin() or fudi_private.is_business_member(o.business_id)
 or (o.coordinator_id=(select auth.uid()) and fudi_private.is_coordinator())));
$$;
revoke all on all functions in schema fudi_private from public,anon,authenticated;
grant execute on function fudi_private.is_admin(), fudi_private.is_business_member(uuid), fudi_private.is_coordinator(), fudi_private.can_read_order(uuid) to authenticated;

-- Bloqueo explícito de escritura desde API hasta implementar las operaciones atómicas.
do $$ declare t text; begin
 foreach t in array array['profiles','businesses','products','drivers','orders','order_items','inventory_reservations','ledger_entries','settlements'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on table public.%I from public,anon,authenticated',t);
  execute format('grant select on table public.%I to authenticated',t);
 end loop;
 foreach t in array array['admins','business_members','coordinators','delivery_codes','order_events'] loop
  execute format('alter table fudi_private.%I enable row level security',t);
  execute format('revoke all on table fudi_private.%I from public,anon,authenticated',t);
 end loop;
end $$;
grant select on public.businesses, public.products to anon;
-- Evita que el rol anónimo necesite llamar ayudantes privados.
create policy businesses_public on public.businesses for select to anon using(status='approved');
create policy businesses_read on public.businesses for select to authenticated
 using(status='approved' or fudi_private.is_admin() or fudi_private.is_business_member(id));
create policy products_public on public.products for select to anon
 using(available and exists(select 1 from public.businesses b where b.id=business_id and b.status='approved'));
create policy products_read on public.products for select to authenticated
 using(fudi_private.is_admin() or fudi_private.is_business_member(business_id)
 or (available and exists(select 1 from public.businesses b where b.id=business_id and b.status='approved')));
create policy profiles_read on public.profiles for select to authenticated using(id=(select auth.uid()) or fudi_private.is_admin());
create policy drivers_read on public.drivers for select to authenticated
 using(fudi_private.is_admin() or fudi_private.is_coordinator() or fudi_private.is_business_member(business_id));
create policy orders_read on public.orders for select to authenticated using(fudi_private.can_read_order(id));
create policy items_read on public.order_items for select to authenticated using(fudi_private.can_read_order(order_id));
create policy reservations_read on public.inventory_reservations for select to authenticated using(fudi_private.can_read_order(order_id));
create policy ledger_read on public.ledger_entries for select to authenticated using(fudi_private.is_admin() or fudi_private.is_business_member(business_id));
create policy settlements_read on public.settlements for select to authenticated using(fudi_private.is_admin() or fudi_private.is_business_member(business_id));
comment on table public.orders is 'FudiBOX: escrituras solo mediante futuras funciones transaccionales autorizadas. No habilitar INSERT/UPDATE directo al navegador.';
commit;

-- Resultado esperado: 9 tablas públicas con RLS=true.
select tablename, rowsecurity as rls_enabled from pg_tables
where schemaname='public' and tablename in
 ('profiles','businesses','products','drivers','orders','order_items','inventory_reservations','ledger_entries','settlements')
order by tablename;
