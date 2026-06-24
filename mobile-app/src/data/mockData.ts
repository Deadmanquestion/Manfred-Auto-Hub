import type { BookingSummary, CarSummary, LiftSummary, ServiceMenuItem } from "../types/ui";

export const mockCars: CarSummary[] = [
  {
    id: "car-1",
    make: "Toyota",
    model: "Corolla Altis",
    year: 2019,
    license_plate: "SMA 4821K",
    color: "Pearl white",
    next_service: "Oil change due soon"
  },
  {
    id: "car-2",
    make: "Honda",
    model: "Civic",
    year: 2021,
    license_plate: "SLB 1198P",
    color: "Graphite gray",
    next_service: "Tire rotation in 2 months"
  }
];

export const mockLifts: LiftSummary[] = [
  {
    id: "lift-1",
    name: "Lift Bay 1",
    location_label: "Front workshop",
    hourly_rate: 28,
    max_vehicle_weight_kg: 2800
  },
  {
    id: "lift-2",
    name: "Lift Bay 2",
    location_label: "Rear workshop",
    hourly_rate: 24,
    max_vehicle_weight_kg: 2400
  },
  {
    id: "lift-3",
    name: "Alignment Bay",
    location_label: "Precision alignment zone",
    hourly_rate: 36,
    max_vehicle_weight_kg: 2600
  },
  {
    id: "lift-4",
    name: "Washing Bay",
    location_label: "Detailing and wash area",
    hourly_rate: 18,
    max_vehicle_weight_kg: 2200
  }
];

export const mockServiceMenu: ServiceMenuItem[] = [
  {
    id: "service-1",
    name: "Oil change",
    description: "Engine oil and filter replacement with quick inspection.",
    estimated_price: 80,
    estimated_duration_minutes: 60
  },
  {
    id: "service-2",
    name: "Brake inspection",
    description: "Brake pads, rotors, and fluid safety check.",
    estimated_price: 60,
    estimated_duration_minutes: 60
  },
  {
    id: "service-3",
    name: "Diagnostic scan",
    description: "OBD scan and issue review before repair approval.",
    estimated_price: 50,
    estimated_duration_minutes: 45
  }
];

export const mockBookings: BookingSummary[] = [
  {
    id: "booking-1",
    kind: "Service",
    title: "Brake inspection",
    date_label: "Tue, 25 Jun at 10:30 AM",
    car_label: "Toyota Corolla Altis",
    status: "approved",
    payment_status: "unpaid",
    detail: "Assigned to workshop team",
    estimated_price: 60,
    reference_number: "MAH-SVC-204811"
  },
  {
    id: "booking-2",
    kind: "Lift",
    title: "Lift Bay 1 rental",
    date_label: "Sat, 29 Jun at 2:00 PM",
    car_label: "Honda Civic",
    status: "pending",
    payment_status: "unpaid",
    detail: "Waiting for admin approval",
    estimated_price: 48,
    reference_number: "MAH-LIFT-204812"
  },
  {
    id: "booking-3",
    kind: "Service",
    title: "Oil change",
    date_label: "Completed on 12 Jun",
    car_label: "Toyota Corolla Altis",
    status: "completed",
    payment_status: "paid",
    detail: "Receipt available at workshop",
    estimated_price: 80,
    reference_number: "MAH-SVC-204813"
  },
  {
    id: "booking-4",
    kind: "Application",
    title: "Apprentice mechanic application",
    date_label: "Submitted on 18 Jun",
    car_label: "Workshop team",
    status: "pending",
    payment_status: "unpaid",
    detail: "Waiting for admin review",
    estimated_price: 0,
    reference_number: "MAH-JOB-204814"
  }
];
