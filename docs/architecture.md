# Manfred App Architecture

## Purpose

Manfred is the working MVP app for GarageGo, a family car service shop platform. The first version should stay simple, understandable, and easy to extend.

## Applications

### Mobile App

Folder: `mobile-app`

The mobile app is built with React Native and Expo. It is intended for customers who want to:

- Add and manage car profiles
- Book repair or maintenance services
- Request lift rentals
- Track booking and payment status
- Apply for part-time or apprenticeship roles

### Admin Dashboard

Folder: `admin-dashboard`

The admin dashboard is a React web app for workshop staff. It is intended to help admins:

- View service bookings
- Approve or reject lift rental requests
- Manage lift availability
- Review job applications
- Track payment status without processing real payments

### Shared Types

Folder: `shared`

Shared TypeScript definitions live here so the mobile app and admin dashboard use the same data shapes.

## Backend

Supabase will provide:

- Postgres database
- Authentication
- Row Level Security policies
- File storage if needed later

The MVP should keep Supabase access behind small client modules in each app. Shared code should contain types only at this stage.

## Initial Domain Models

The shared types include starter shapes for:

- Customer profiles
- Vehicles
- Service catalog items
- Service bookings
- Lift rental requests
- Lift availability
- Job applications
- Payment status

These types are placeholders for planning and should be adjusted when the Supabase schema is created.

## Suggested Data Flow

```text
Mobile App/Admin Dashboard
  -> Supabase client
  -> Supabase Auth + Postgres
  -> Shared TypeScript types for consistency
```

## MVP Boundaries

The initial MVP should not include:

- Real payment processing
- Complex inventory management
- Advanced scheduling automation
- Customer chat
- Accounting or invoice generation

The app may store `payment_status` values such as `unpaid`, `paid`, or `refunded`, but no payment gateway should be integrated yet.

## Recently Added MVP Extensions

- Service menu: customers choose from starter services with estimated price and duration.
- Booking photo placeholder: customers can attach a photo link/caption to a service request until real Supabase Storage upload is added.
- Admin calendar: admins can view service bookings and lift rentals together in date order.
