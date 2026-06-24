# Manfred Database Design

## Big Picture

Manfred uses Supabase for accounts, data storage, and security rules.

Supabase already has a built-in `auth.users` table for login accounts. The app adds a `profiles` table that stores app-specific details for each user, such as name, phone number, and role.

The migration also adds a small sign-up trigger. When Supabase Auth creates a new user, Manfred automatically creates a matching `profiles` row with the default `customer` role.

The three app roles are:

- `customer`: a normal user booking services or lifts
- `admin`: a workshop staff member who can approve, reject, and manage records
- `mechanic`: a workshop mechanic who can view assigned service jobs

## Status Values

Lift bookings and service bookings use the same status list:

- `pending`: customer has requested the booking
- `approved`: admin accepted the booking
- `rejected`: admin rejected the booking
- `cancelled`: booking was cancelled
- `completed`: work or rental is finished

Payments are intentionally simple for the MVP. There is no real payment gateway. Tables only store:

- `unpaid`
- `paid`
- `refunded`

## Tables

### profiles

Stores app profile information for each Supabase Auth user.

Important columns:

- `id`: same ID as the matching `auth.users` account
- `full_name`, `email`, `phone`: user contact details
- `role`: customer, admin, or mechanic

### cars

Stores customer car profiles.

Each car belongs to one profile through `user_id`.

### lifts

Stores workshop lift information.

Admins can manage lifts. Customers can read active lifts so they can request a booking.

### service_catalog

Stores the workshop's simple service menu.

Examples:

- Oil change
- Brake inspection
- Battery check
- Diagnostic scan

Each service has an estimated price and estimated duration. These are only estimates for the MVP. They help customers understand the likely cost before booking, and they help the admin dashboard calculate simple mock revenue without adding real payments.

### lift_bookings

Stores customer requests to rent a lift.

Important columns:

- `user_id`: customer who made the booking
- `car_id`: optional car connected to the booking
- `lift_id`: lift being requested
- `requested_start_at` and `requested_end_at`: booking time window
- `status`: admin approval state
- `payment_status`: unpaid, paid, or refunded
- `reviewed_by` and `reviewed_at`: admin approval tracking

Lift bookings also have conflict protection. A booking must be inside workshop opening hours, cannot overlap another active lift booking, and respects a 15-minute cleanup buffer after each booking. Admins can block unavailable windows in `lift_unavailable_slots`, and those blocked windows are treated as unavailable for customers.

For the MVP, workshop hours are Monday to Saturday, 08:00 to 18:00 Singapore time.

### lift_unavailable_slots

Stores admin-blocked lift times.

Examples:

- lift maintenance
- cleaning time
- private workshop use
- holidays or staff breaks

Customers do not book directly against this table. The mobile app reads these rows when showing available lift slots, and the database trigger uses them to reject unavailable bookings.

### service_bookings

Stores customer repair or maintenance bookings.

Important columns:

- `user_id`: customer who made the booking
- `car_id`: car needing service
- `mechanic_id`: optional mechanic assignment
- `service_catalog_id`: optional link to a service menu item
- `service_type`: simple text label for the requested service
- `estimated_price`: copied from the service menu at booking time
- `service_date`: requested service date
- `status`: admin approval state
- `payment_status`: unpaid, paid, or refunded

For the MVP, mechanic assignment is intentionally simple: one service booking can have one assigned mechanic.

### mechanics

Stores mechanic profile details.

Each mechanic links back to a row in `profiles`. This keeps login/account data separate from mechanic-specific data like specialties and bio.

### job_applications

Stores part-time and apprenticeship applications.

Applicants are connected to a user account through `user_id`. Applications include contact details, age, availability, interested role, previous experience, reason for applying, emergency contact, and guardian consent for applicants under 18.

Admins can update applications using these MVP statuses:

- `pending`
- `interview`
- `approved`
- `rejected`

Admins can also add `admin_notes` directly to the application record.

### booking_photos

Stores references to uploaded photos for bookings.

This table stores the file path in Supabase Storage, not the image file itself. A photo can belong to either a service booking or a lift booking.

For the current prototype, the mobile app can save a photo URL placeholder with a service booking. Real image upload can be added later using Supabase Storage.

### admin_notes

Stores private admin notes attached to app records.

Admins can attach notes to users, cars, bookings, job applications, or mechanics. Customers cannot read admin notes.

## Creating the First Admin

The first admin cannot promote themself from the app because normal users are not allowed to change their own role.

For the MVP, create your first user account, then update that row in Supabase using the SQL editor or table editor:

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin-email@example.com';
```

After that, the admin dashboard can manage approvals and staff records.

## Security Rules

Row Level Security is enabled on every app table.

The MVP rules are:

- Customers can read and manage their own profile, cars, bookings, applications, and uploaded photos.
- Admins can read and manage all app data.
- Mechanics can read their own mechanic profile.
- Mechanics can read service bookings assigned to them.
- Admin notes are admin-only.

Users are not allowed to approve their own bookings. Customer-created bookings start as `pending` and `unpaid`. Admins update booking status when approving, rejecting, or completing work.

## Useful Indexes

The migration adds simple indexes for common MVP queries:

- lookup records by `user_id`
- list bookings by date
- filter bookings by status
- find service bookings assigned to a mechanic
- find photos and notes related to a booking

These indexes keep the most common dashboard and customer app screens fast without overcomplicating the first version.
