export type BookingKind = "Service" | "Lift" | "Application";

export type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type ApplicationRole =
  | "workshop_helper"
  | "car_wash_crew"
  | "apprentice_mechanic"
  | "content_creator"
  | "spare_parts_assistant"
  | "customer_service_helper";

export interface CarSummary {
  id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  color: string;
  next_service: string;
}

export interface BookingSummary {
  id: string;
  kind: BookingKind;
  title: string;
  date_label: string;
  car_label: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  detail: string;
  estimated_price: number;
  reference_number: string;
}

export interface LiftSummary {
  id: string;
  name: string;
  location_label: string;
  hourly_rate: number;
  max_vehicle_weight_kg: number;
}

export interface LiftAvailabilitySlot {
  id: string;
  lift_id: string;
  starts_at: string;
  ends_at: string;
  label: string;
}

export interface ServiceMenuItem {
  id: string;
  name: string;
  description: string;
  estimated_price: number;
  estimated_duration_minutes: number;
}
