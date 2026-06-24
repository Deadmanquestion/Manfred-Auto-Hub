# Manfred

Manfred is an MVP starter workspace for a family car service shop app.

The product idea is GarageGo: a modern automotive service platform where customers can book car repair services, request lift rentals, manage car profiles, and apply for part-time or apprenticeship opportunities. Workshop admins can review bookings, approve or reject lift rental requests, manage lift availability, and review job applications.

This repository currently contains the MVP starter structure, Supabase database migrations, and the first connected mobile flows. Full production features and real payments are intentionally not implemented yet.

Current MVP add-ons include a starter service menu with estimated prices, service booking photo/link placeholders, and an admin calendar view for workshop scheduling.

## Tech Stack

- Mobile app: React Native with Expo
- Admin dashboard: React web app
- Backend/database: Supabase
- Language: TypeScript
- Payments: no real payment integration yet; future records should use a `payment_status` field only

## Project Structure

```text
manfred/
  mobile-app/          Expo React Native customer app
  admin-dashboard/     React web app for workshop admins
  shared/              Shared TypeScript types and constants
  supabase/            Database migrations and Supabase setup
  docs/                Architecture and planning documents
```

## Getting Started

First, open a terminal in the Manfred project folder:

```bash
cd C:\Users\Admin\Documents\Codex\2026-06-21\you-are-helping-me-build-an
```

Install dependencies from the repository root:

```bash
npm install
```

The mobile app is set up for Expo SDK 56, which expects Node.js 22.13.x or newer.

Start the mobile app:

```bash
npm run mobile
```

If your terminal is already inside `mobile-app`, this also works:

```bash
npm run mobile
```

Useful mobile shortcuts:

```bash
npm run mobile:android
npm run mobile:ios
npm run mobile:web
```

The first mobile UI version includes these mock-data screens:

- Login
- Register
- Home
- My Cars
- Add Car
- Book Service
- Book Car Lift
- My Bookings
- Job / Apprentice Application
- Profile

Start the admin dashboard:

```bash
npm run admin
```

If your terminal is inside `mobile-app`, you can still start the admin dashboard with:

```bash
npm run admin
```

For the admin dashboard, copy the example environment file and add your Supabase values:

```bash
copy admin-dashboard\.env.example admin-dashboard\.env
```

Then fill in:

```text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

The admin login uses Supabase Auth. The logged-in account must have a matching `profiles` row with `role = 'admin'`.

Run TypeScript checks across workspaces:

```bash
npm run typecheck
```

## Environment Variables

Create local environment files for Supabase:

```text
mobile-app/.env
admin-dashboard/.env
```

Expected future variables:

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Do not commit `.env` files.

For the mobile app, copy the example file and add your real Supabase values:

```bash
copy mobile-app\.env.example mobile-app\.env
```

Then fill in:

```text
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Run the Supabase migrations in `supabase/migrations` before testing the connected app. The lift booking screen also needs at least one active row in the `lifts` table.

## Next Steps

1. Add Expo dependencies inside `mobile-app`.
2. Add React/Vite dependencies inside `admin-dashboard`.
3. Create the Supabase project and run the migrations in `supabase/migrations`.
4. Build authentication and basic booking flows.
5. Add admin booking and lift rental review screens.

## Database Docs

See [docs/database-design.md](docs/database-design.md) for a beginner-friendly explanation of the Supabase schema and Row Level Security rules.
