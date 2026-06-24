create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public, auth
as $$
  select role
  from public.profiles
  where id = auth.uid();
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.current_user_mechanic_id()
returns uuid
language sql
stable
security definer
set search_path = public, auth
as $$
  select id
  from public.mechanics
  where profile_id = auth.uid()
    and is_active = true
  limit 1;
$$;

alter table public.profiles enable row level security;
alter table public.cars enable row level security;
alter table public.lifts enable row level security;
alter table public.lift_bookings enable row level security;
alter table public.service_bookings enable row level security;
alter table public.mechanics enable row level security;
alter table public.job_applications enable row level security;
alter table public.booking_photos enable row level security;
alter table public.admin_notes enable row level security;

create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.current_user_is_admin());

create policy "profiles_insert_own_customer"
on public.profiles
for insert
to authenticated
with check (id = auth.uid() and role = 'customer');

create policy "profiles_insert_admin"
on public.profiles
for insert
to authenticated
with check (public.current_user_is_admin());

create policy "profiles_update_own_without_role_change"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid() and role = public.current_user_role());

create policy "profiles_update_admin"
on public.profiles
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

create policy "cars_select_own_or_admin"
on public.cars
for select
to authenticated
using (user_id = auth.uid() or public.current_user_is_admin());

create policy "cars_insert_own_or_admin"
on public.cars
for insert
to authenticated
with check (user_id = auth.uid() or public.current_user_is_admin());

create policy "cars_update_own_or_admin"
on public.cars
for update
to authenticated
using (user_id = auth.uid() or public.current_user_is_admin())
with check (user_id = auth.uid() or public.current_user_is_admin());

create policy "cars_delete_own_or_admin"
on public.cars
for delete
to authenticated
using (user_id = auth.uid() or public.current_user_is_admin());

create policy "lifts_select_active_or_admin"
on public.lifts
for select
to authenticated
using (is_active = true or public.current_user_is_admin());

create policy "lifts_insert_admin"
on public.lifts
for insert
to authenticated
with check (public.current_user_is_admin());

create policy "lifts_update_admin"
on public.lifts
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

create policy "lifts_delete_admin"
on public.lifts
for delete
to authenticated
using (public.current_user_is_admin());

create policy "mechanics_select_own_or_admin"
on public.mechanics
for select
to authenticated
using (profile_id = auth.uid() or public.current_user_is_admin());

create policy "mechanics_insert_admin"
on public.mechanics
for insert
to authenticated
with check (public.current_user_is_admin());

create policy "mechanics_update_own_or_admin"
on public.mechanics
for update
to authenticated
using (profile_id = auth.uid() or public.current_user_is_admin())
with check (profile_id = auth.uid() or public.current_user_is_admin());

create policy "mechanics_delete_admin"
on public.mechanics
for delete
to authenticated
using (public.current_user_is_admin());

create policy "lift_bookings_select_own_or_admin"
on public.lift_bookings
for select
to authenticated
using (user_id = auth.uid() or public.current_user_is_admin());

create policy "lift_bookings_insert_own_pending"
on public.lift_bookings
for insert
to authenticated
with check (
  user_id = auth.uid()
  and status = 'pending'
  and payment_status = 'unpaid'
  and (
    car_id is null
    or exists (
      select 1
      from public.cars
      where cars.id = lift_bookings.car_id
        and cars.user_id = auth.uid()
    )
  )
);

create policy "lift_bookings_insert_admin"
on public.lift_bookings
for insert
to authenticated
with check (public.current_user_is_admin());

create policy "lift_bookings_update_own_pending_or_cancelled"
on public.lift_bookings
for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and status in ('pending', 'cancelled')
  and payment_status = 'unpaid'
  and (
    car_id is null
    or exists (
      select 1
      from public.cars
      where cars.id = lift_bookings.car_id
        and cars.user_id = auth.uid()
    )
  )
);

create policy "lift_bookings_update_admin"
on public.lift_bookings
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

create policy "lift_bookings_delete_admin"
on public.lift_bookings
for delete
to authenticated
using (public.current_user_is_admin());

create policy "service_bookings_select_own_admin_or_assigned_mechanic"
on public.service_bookings
for select
to authenticated
using (
  user_id = auth.uid()
  or public.current_user_is_admin()
  or mechanic_id = public.current_user_mechanic_id()
);

create policy "service_bookings_insert_own_pending"
on public.service_bookings
for insert
to authenticated
with check (
  user_id = auth.uid()
  and status = 'pending'
  and payment_status = 'unpaid'
  and exists (
    select 1
    from public.cars
    where cars.id = service_bookings.car_id
      and cars.user_id = auth.uid()
  )
);

create policy "service_bookings_insert_admin"
on public.service_bookings
for insert
to authenticated
with check (public.current_user_is_admin());

create policy "service_bookings_update_own_pending_or_cancelled"
on public.service_bookings
for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and status in ('pending', 'cancelled')
  and payment_status = 'unpaid'
  and exists (
    select 1
    from public.cars
    where cars.id = service_bookings.car_id
      and cars.user_id = auth.uid()
  )
);

create policy "service_bookings_update_admin"
on public.service_bookings
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

create policy "service_bookings_delete_admin"
on public.service_bookings
for delete
to authenticated
using (public.current_user_is_admin());

create policy "job_applications_select_own_or_admin"
on public.job_applications
for select
to authenticated
using (user_id = auth.uid() or public.current_user_is_admin());

create policy "job_applications_insert_own_pending"
on public.job_applications
for insert
to authenticated
with check (user_id = auth.uid() and status = 'pending');

create policy "job_applications_update_own_pending_or_cancelled"
on public.job_applications
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid() and status in ('pending', 'cancelled'));

create policy "job_applications_update_admin"
on public.job_applications
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

create policy "job_applications_delete_admin"
on public.job_applications
for delete
to authenticated
using (public.current_user_is_admin());

create policy "booking_photos_select_related_or_admin"
on public.booking_photos
for select
to authenticated
using (
  public.current_user_is_admin()
  or uploaded_by = auth.uid()
  or exists (
    select 1
    from public.service_bookings
    where service_bookings.id = booking_photos.service_booking_id
      and (
        service_bookings.user_id = auth.uid()
        or service_bookings.mechanic_id = public.current_user_mechanic_id()
      )
  )
  or exists (
    select 1
    from public.lift_bookings
    where lift_bookings.id = booking_photos.lift_booking_id
      and lift_bookings.user_id = auth.uid()
  )
);

create policy "booking_photos_insert_related_or_admin"
on public.booking_photos
for insert
to authenticated
with check (
  public.current_user_is_admin()
  or (
    uploaded_by = auth.uid()
    and (
      exists (
        select 1
        from public.service_bookings
        where service_bookings.id = booking_photos.service_booking_id
          and service_bookings.user_id = auth.uid()
      )
      or exists (
        select 1
        from public.lift_bookings
        where lift_bookings.id = booking_photos.lift_booking_id
          and lift_bookings.user_id = auth.uid()
      )
    )
  )
);

create policy "booking_photos_update_own_or_admin"
on public.booking_photos
for update
to authenticated
using (uploaded_by = auth.uid() or public.current_user_is_admin())
with check (
  public.current_user_is_admin()
  or (
    uploaded_by = auth.uid()
    and (
      exists (
        select 1
        from public.service_bookings
        where service_bookings.id = booking_photos.service_booking_id
          and service_bookings.user_id = auth.uid()
      )
      or exists (
        select 1
        from public.lift_bookings
        where lift_bookings.id = booking_photos.lift_booking_id
          and lift_bookings.user_id = auth.uid()
      )
    )
  )
);

create policy "booking_photos_delete_own_or_admin"
on public.booking_photos
for delete
to authenticated
using (uploaded_by = auth.uid() or public.current_user_is_admin());

create policy "admin_notes_admin_only"
on public.admin_notes
for all
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());
