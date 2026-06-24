create table if not exists public.lift_unavailable_slots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  lift_id uuid not null references public.lifts (id) on delete cascade,
  blocked_start_at timestamptz not null,
  blocked_end_at timestamptz not null,
  reason text,
  created_by uuid references public.profiles (id) on delete set null,
  constraint lift_unavailable_slots_time_order check (blocked_end_at > blocked_start_at)
);

drop trigger if exists set_lift_unavailable_slots_updated_at on public.lift_unavailable_slots;
create trigger set_lift_unavailable_slots_updated_at
before update on public.lift_unavailable_slots
for each row execute function public.set_updated_at();

create index if not exists lift_unavailable_slots_lift_id_idx
on public.lift_unavailable_slots (lift_id);

create index if not exists lift_unavailable_slots_start_idx
on public.lift_unavailable_slots (blocked_start_at);

create or replace function public.is_within_workshop_hours(
  p_start timestamptz,
  p_end timestamptz
)
returns boolean
language plpgsql
stable
as $$
declare
  local_start timestamp;
  local_end timestamp;
  local_day integer;
begin
  if p_end <= p_start then
    return false;
  end if;

  local_start := p_start at time zone 'Asia/Singapore';
  local_end := p_end at time zone 'Asia/Singapore';
  local_day := extract(isodow from local_start);

  -- MVP workshop hours: Monday to Saturday, 08:00 through 18:00 Singapore time.
  -- Bookings must start and end on the same local date so they cannot cross overnight.
  return local_day between 1 and 6
    and local_start::date = local_end::date
    and local_start::time >= time '08:00'
    and local_end::time <= time '18:00';
end;
$$;

create or replace function public.lift_slot_has_conflict(
  p_lift_id uuid,
  p_start timestamptz,
  p_end timestamptz,
  p_ignore_booking_id uuid default null
)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.lift_bookings
    where lift_id = p_lift_id
      and status in ('pending', 'approved', 'completed')
      and (p_ignore_booking_id is null or id <> p_ignore_booking_id)
      -- Conflict rule: a new booking overlaps an existing booking when it starts
      -- before the existing booking's end plus the required 15-minute cleanup buffer,
      -- and ends after the existing booking starts.
      and p_start < requested_end_at + interval '15 minutes'
      and p_end > requested_start_at
  )
  or exists (
    select 1
    from public.lift_unavailable_slots
    where lift_id = p_lift_id
      -- Admin blocked slots are exact unavailable windows. Any overlap blocks booking.
      and p_start < blocked_end_at
      and p_end > blocked_start_at
  );
$$;

create or replace function public.validate_lift_booking_availability()
returns trigger
language plpgsql
as $$
begin
  if new.status in ('rejected', 'cancelled') then
    return new;
  end if;

  if not public.is_within_workshop_hours(new.requested_start_at, new.requested_end_at) then
    raise exception 'Selected lift booking time is outside workshop opening hours.';
  end if;

  if public.lift_slot_has_conflict(
    new.lift_id,
    new.requested_start_at,
    new.requested_end_at,
    case when tg_op = 'UPDATE' then new.id else null end
  ) then
    raise exception 'Selected lift booking time is unavailable. Please choose another slot.';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_lift_booking_availability_trigger on public.lift_bookings;
create trigger validate_lift_booking_availability_trigger
before insert or update of lift_id, requested_start_at, requested_end_at, status
on public.lift_bookings
for each row execute function public.validate_lift_booking_availability();

alter table public.lift_unavailable_slots enable row level security;

create policy "lift_unavailable_slots_select_authenticated"
on public.lift_unavailable_slots
for select
to authenticated
using (true);

create policy "lift_unavailable_slots_insert_admin"
on public.lift_unavailable_slots
for insert
to authenticated
with check (public.current_user_is_admin());

create policy "lift_unavailable_slots_update_admin"
on public.lift_unavailable_slots
for update
to authenticated
using (public.current_user_is_admin())
with check (public.current_user_is_admin());

create policy "lift_unavailable_slots_delete_admin"
on public.lift_unavailable_slots
for delete
to authenticated
using (public.current_user_is_admin());

