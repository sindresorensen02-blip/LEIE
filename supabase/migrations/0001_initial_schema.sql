-- Leie - Initial schema
-- Bergen sentrum-first rental discovery app

create extension if not exists "pgcrypto";

-- ============================================================
-- Enums
-- ============================================================

do $$ begin
  create type user_role as enum ('user', 'landlord', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type property_type as enum ('room', 'studio', 'apartment', 'house');
exception when duplicate_object then null; end $$;

do $$ begin
  create type listing_status as enum ('draft', 'active', 'rented', 'archived');
exception when duplicate_object then null; end $$;

-- ============================================================
-- profiles
-- One row per auth user.
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- listings
-- ============================================================

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text not null default '',
  property_type property_type not null,
  price_monthly integer not null check (price_monthly >= 0),
  size_m2 integer not null check (size_m2 >= 0),
  bedrooms integer not null default 0 check (bedrooms >= 0),
  furnished boolean not null default false,
  address_text text not null,
  area text not null,
  city text not null default 'Bergen',
  latitude double precision not null,
  longitude double precision not null,
  available_from date,
  external_url text,
  status listing_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_status_idx on public.listings (status);
create index if not exists listings_city_area_idx on public.listings (city, area);
create index if not exists listings_geo_idx on public.listings (latitude, longitude);
-- TODO: enable PostGIS and add a geography(Point) column for spatial queries
-- create extension if not exists postgis;
-- alter table public.listings add column geom geography(Point, 4326);

-- ============================================================
-- listing_images
-- ============================================================

create table if not exists public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists listing_images_listing_idx on public.listing_images (listing_id, sort_order);

-- ============================================================
-- favorites
-- ============================================================

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, listing_id)
);

create index if not exists favorites_user_idx on public.favorites (user_id);

-- ============================================================
-- updated_at trigger
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_listings on public.listings;
create trigger set_updated_at_listings
  before update on public.listings
  for each row execute function public.set_updated_at();

-- ============================================================
-- Auto-create profile on signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Helper: is_admin
-- ============================================================

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = uid and role = 'admin'
  );
$$;

create or replace function public.has_role(uid uuid, required_roles user_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = uid and role = any(required_roles)
  );
$$;

-- ============================================================
-- RLS
-- ============================================================

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.favorites enable row level security;

-- profiles: anyone can read (so we can show landlord names),
-- but only the owner (or admin) can insert/update.
drop policy if exists "profiles_read_all" on public.profiles;
create policy "profiles_read_all" on public.profiles
  for select using (true);

drop policy if exists "profiles_insert_self" on public.profiles;
create policy "profiles_insert_self" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update using (auth.uid() = id or public.is_admin(auth.uid()))
  with check (auth.uid() = id or public.is_admin(auth.uid()));

-- listings: anyone can read active listings;
-- owners and admins can read their own non-active listings.
drop policy if exists "listings_read_active" on public.listings;
create policy "listings_read_active" on public.listings
  for select using (
    status = 'active'
    or owner_id = auth.uid()
    or public.is_admin(auth.uid())
  );

-- only landlords/admins can create listings, and only as themselves
drop policy if exists "listings_insert_landlord_or_admin" on public.listings;
create policy "listings_insert_landlord_or_admin" on public.listings
  for insert with check (
    auth.uid() = owner_id
    and public.has_role(auth.uid(), array['landlord','admin']::user_role[])
  );

-- only owner or admin can update
drop policy if exists "listings_update_owner_or_admin" on public.listings;
create policy "listings_update_owner_or_admin" on public.listings
  for update using (owner_id = auth.uid() or public.is_admin(auth.uid()))
  with check (owner_id = auth.uid() or public.is_admin(auth.uid()));

-- only admins can hard delete; owners should soft-delete via status='archived'
drop policy if exists "listings_delete_admin_only" on public.listings;
create policy "listings_delete_admin_only" on public.listings
  for delete using (public.is_admin(auth.uid()));

-- listing_images
drop policy if exists "listing_images_read" on public.listing_images;
create policy "listing_images_read" on public.listing_images
  for select using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.status = 'active' or l.owner_id = auth.uid() or public.is_admin(auth.uid()))
    )
  );

drop policy if exists "listing_images_write_owner" on public.listing_images;
create policy "listing_images_write_owner" on public.listing_images
  for insert with check (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.owner_id = auth.uid() or public.is_admin(auth.uid()))
    )
  );

drop policy if exists "listing_images_update_owner" on public.listing_images;
create policy "listing_images_update_owner" on public.listing_images
  for update using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.owner_id = auth.uid() or public.is_admin(auth.uid()))
    )
  );

drop policy if exists "listing_images_delete_owner" on public.listing_images;
create policy "listing_images_delete_owner" on public.listing_images
  for delete using (
    exists (
      select 1 from public.listings l
      where l.id = listing_id
        and (l.owner_id = auth.uid() or public.is_admin(auth.uid()))
    )
  );

-- favorites: users own their own favorites
drop policy if exists "favorites_select_own" on public.favorites;
create policy "favorites_select_own" on public.favorites
  for select using (user_id = auth.uid());

drop policy if exists "favorites_insert_own" on public.favorites;
create policy "favorites_insert_own" on public.favorites
  for insert with check (user_id = auth.uid());

drop policy if exists "favorites_delete_own" on public.favorites;
create policy "favorites_delete_own" on public.favorites
  for delete using (user_id = auth.uid());
