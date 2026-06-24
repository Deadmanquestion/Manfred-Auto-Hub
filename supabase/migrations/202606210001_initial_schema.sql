create extension if not exists "pgcrypto";

do $$
begin
  create type public.user_role as enum ('customer', 'admin', 'mechanic');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.booking_status as enum (
    'pending',
    'approved',
    'rejected',
    'cancelled',
    'completed'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.payment_status as enum ('unpaid', 'paid', 'refunded');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.application_status as enum (
    'pending',
    'approved',
    'rejected',
    'cancelled'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.application_role as enum ('part_time', 'apprenticeship');
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text unique,
  full_name text not null,
  phone text,
  role public.user_role not null default 'customer'
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'New Customer')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  make text not null,
  model text not null,
  year integer check (year is null or (year >= 1886 and year <= 2100)),
  license_plate text,
  vin text,
  color text,
  notes text
);

create table if not exists public.lifts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  description text,
  location_label text,
  hourly_rate numeric(10, 2),
  max_vehicle_weight_kg integer,
  is_active boolean not null default true
);

create table if not exists public.mechanics (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  display_name text not null,
  specialties text[] not null default '{}',
  bio text,
  is_active boolean not null default true
);

create table if not exists public.lift_bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  car_id uuid references public.cars (id) on delete set null,
  lift_id uuid not null references public.lifts (id) on delete restrict,
  requested_start_at timestamptz not null,
  requested_end_at timestamptz not null,
  status public.booking_status not null default 'pending',
  payment_status public.payment_status not null default 'unpaid',
  customer_notes text,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  constraint lift_bookings_time_order check (requested_end_at > requested_start_at)
);

create table if not exists public.service_bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  car_id uuid not null references public.cars (id) on delete restrict,
  mechanic_id uuid references public.mechanics (id) on delete set null,
  service_type text not null,
  service_date timestamptz not null,
  status public.booking_status not null default 'pending',
  payment_status public.payment_status not null default 'unpaid',
  customer_notes text,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  applicant_name text not null,
  email text not null,
  phone text,
  role_type public.application_role not null,
  message text,
  status public.application_status not null default 'pending',
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz
);

create table if not exists public.booking_photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  uploaded_by uuid references public.profiles (id) on delete set null,
  service_booking_id uuid references public.service_bookings (id) on delete cascade,
  lift_booking_id uuid references public.lift_bookings (id) on delete cascade,
  storage_path text not null,
  caption text,
  constraint booking_photos_one_booking check (
    num_nonnulls(service_booking_id, lift_booking_id) = 1
  )
);

create table if not exists public.admin_notes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  author_id uuid not null references public.profiles (id) on delete restrict,
  profile_id uuid references public.profiles (id) on delete cascade,
  car_id uuid references public.cars (id) on delete cascade,
  lift_booking_id uuid references public.lift_bookings (id) on delete cascade,
  service_booking_id uuid references public.service_bookings (id) on delete cascade,
  job_application_id uuid references public.job_applications (id) on delete cascade,
  mechanic_id uuid references public.mechanics (id) on delete cascade,
  note_text text not null,
  constraint admin_notes_has_target check (
    num_nonnulls(
      profile_id,
      car_id,
      lift_booking_id,
      service_booking_id,
      job_application_id,
      mechanic_id
    ) >= 1
  )
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_cars_updated_at on public.cars;
create trigger set_cars_updated_at
before update on public.cars
for each row execute function public.set_updated_at();

drop trigger if exists set_lifts_updated_at on public.lifts;
create trigger set_lifts_updated_at
before update on public.lifts
for each row execute function public.set_updated_at();

drop trigger if exists set_mechanics_updated_at on public.mechanics;
create trigger set_mechanics_updated_at
before update on public.mechanics
for each row execute function public.set_updated_at();

drop trigger if exists set_lift_bookings_updated_at on public.lift_bookings;
create trigger set_lift_bookings_updated_at
before update on public.lift_bookings
for each row execute function public.set_updated_at();

drop trigger if exists set_service_bookings_updated_at on public.service_bookings;
create trigger set_service_bookings_updated_at
before update on public.service_bookings
for each row execute function public.set_updated_at();

drop trigger if exists set_job_applications_updated_at on public.job_applications;
create trigger set_job_applications_updated_at
before update on public.job_applications
for each row execute function public.set_updated_at();

drop trigger if exists set_booking_photos_updated_at on public.booking_photos;
create trigger set_booking_photos_updated_at
before update on public.booking_photos
for each row execute function public.set_updated_at();

drop trigger if exists set_admin_notes_updated_at on public.admin_notes;
create trigger set_admin_notes_updated_at
before update on public.admin_notes
for each row execute function public.set_updated_at();

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists cars_user_id_idx on public.cars (user_id);
create index if not exists cars_license_plate_idx on public.cars (license_plate);
create index if not exists mechanics_profile_id_idx on public.mechanics (profile_id);
create index if not exists lift_bookings_user_id_idx on public.lift_bookings (user_id);
create index if not exists lift_bookings_lift_id_idx on public.lift_bookings (lift_id);
create index if not exists lift_bookings_requested_start_at_idx on public.lift_bookings (requested_start_at);
create index if not exists lift_bookings_status_idx on public.lift_bookings (status);
create index if not exists service_bookings_user_id_idx on public.service_bookings (user_id);
create index if not exists service_bookings_car_id_idx on public.service_bookings (car_id);
create index if not exists service_bookings_mechanic_id_idx on public.service_bookings (mechanic_id);
create index if not exists service_bookings_service_date_idx on public.service_bookings (service_date);
create index if not exists service_bookings_status_idx on public.service_bookings (status);
create index if not exists job_applications_user_id_idx on public.job_applications (user_id);
create index if not exists job_applications_created_at_idx on public.job_applications (created_at);
create index if not exists job_applications_status_idx on public.job_applications (status);
create index if not exists booking_photos_uploaded_by_idx on public.booking_photos (uploaded_by);
create index if not exists booking_photos_service_booking_id_idx on public.booking_photos (service_booking_id);
create index if not exists booking_photos_lift_booking_id_idx on public.booking_photos (lift_booking_id);
create index if not exists admin_notes_author_id_idx on public.admin_notes (author_id);
create index if not exists admin_notes_profile_id_idx on public.admin_notes (profile_id);
create index if not exists admin_notes_car_id_idx on public.admin_notes (car_id);
create index if not exists admin_notes_lift_booking_id_idx on public.admin_notes (lift_booking_id);
create index if not exists admin_notes_service_booking_id_idx on public.admin_notes (service_booking_id);
create index if not exists admin_notes_job_application_id_idx on public.admin_notes (job_application_id);
