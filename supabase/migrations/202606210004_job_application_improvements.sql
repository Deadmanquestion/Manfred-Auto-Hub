alter type public.application_status add value if not exists 'interview';

alter type public.application_role add value if not exists 'workshop_helper';
alter type public.application_role add value if not exists 'car_wash_crew';
alter type public.application_role add value if not exists 'apprentice_mechanic';
alter type public.application_role add value if not exists 'content_creator';
alter type public.application_role add value if not exists 'spare_parts_assistant';
alter type public.application_role add value if not exists 'customer_service_helper';

alter table public.job_applications
add column if not exists age integer check (age is null or (age >= 10 and age <= 100)),
add column if not exists available_working_days text[] not null default '{}',
add column if not exists available_time text,
add column if not exists previous_experience text,
add column if not exists reason_for_applying text,
add column if not exists emergency_contact text,
add column if not exists guardian_consent boolean not null default false,
add column if not exists admin_notes text;

create index if not exists job_applications_role_type_idx
on public.job_applications (role_type);

