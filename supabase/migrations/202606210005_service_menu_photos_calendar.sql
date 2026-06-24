create table if not exists public.service_catalog (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null unique,
  description text,
  estimated_price numeric(10, 2) not null default 0,
  estimated_duration_minutes integer not null default 60,
  is_active boolean not null default true
);

alter table public.service_bookings
add column if not exists service_catalog_id uuid references public.service_catalog (id) on delete set null,
add column if not exists estimated_price numeric(10, 2);

alter table public.booking_photos
add column if not exists photo_url text;

drop trigger if exists set_service_catalog_updated_at on public.service_catalog;
create trigger set_service_catalog_updated_at
before update on public.service_catalog
for each row execute function public.set_updated_at();

create index if not exists service_catalog_is_active_idx
on public.service_catalog (is_active);

create index if not exists service_bookings_service_catalog_id_idx
on public.service_bookings (service_catalog_id);

insert into public.service_catalog (name, description, estimated_price, estimated_duration_minutes)
values
  ('Oil change', 'Engine oil and filter replacement.', 80, 60),
  ('Brake inspection', 'Brake pads, rotors, and fluid safety check.', 60, 60),
  ('Battery check', 'Battery health and charging system check.', 35, 30),
  ('Diagnostic scan', 'Basic OBD scan and issue review.', 50, 45),
  ('Tire rotation', 'Rotate tires and quick pressure check.', 40, 45)
on conflict (name) do nothing;

alter table public.service_catalog enable row level security;

create policy "service_catalog_select_authenticated"
on public.service_catalog
for select
to authenticated
using (is_active = true or public.current_user_is_admin());

create policy "service_catalog_insert_admin"
on public.service_catalog
for insert
to authenticated
with check (public.current_user_is_admin());

create policy "service_catalog_update_admin"
on public.service_catalog
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

create policy "service_catalog_delete_admin"
on public.service_catalog
for delete
to authenticated
using (public.current_user_is_admin());
