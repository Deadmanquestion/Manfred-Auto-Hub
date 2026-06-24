export type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type ApplicationStatus = "pending" | "interview" | "approved" | "rejected";

export type ApplicationRole =
  | "part_time"
  | "apprenticeship"
  | "workshop_helper"
  | "car_wash_crew"
  | "apprentice_mechanic"
  | "content_creator"
  | "spare_parts_assistant"
  | "customer_service_helper";

export interface ProfileRow {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  role: "customer" | "admin" | "mechanic";
}

export interface CarRow {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number | null;
  license_plate: string | null;
  color: string | null;
  notes: string | null;
  created_at: string;
}

export interface LiftRow {
  id: string;
  name: string;
  description: string | null;
  location_label: string | null;
  hourly_rate: number | null;
  max_vehicle_weight_kg: number | null;
  is_active: boolean;
  created_at: string;
}

export interface LiftBookingRow {
  id: string;
  user_id: string;
  car_id: string | null;
  lift_id: string;
  requested_start_at: string;
  requested_end_at: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  customer_notes: string | null;
  created_at: string;
}

export interface LiftUnavailableSlotRow {
  id: string;
  lift_id: string;
  blocked_start_at: string;
  blocked_end_at: string;
  reason: string | null;
  created_at: string;
}

export interface ServiceBookingRow {
  id: string;
  user_id: string;
  car_id: string;
  mechanic_id: string | null;
  service_catalog_id: string | null;
  service_type: string;
  estimated_price: number | null;
  service_date: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  customer_notes: string | null;
  created_at: string;
}

export interface JobApplicationRow {
  id: string;
  user_id: string;
  applicant_name: string;
  age: number | null;
  email: string;
  phone: string | null;
  available_working_days: string[];
  available_time: string | null;
  role_type: ApplicationRole;
  previous_experience: string | null;
  reason_for_applying: string | null;
  emergency_contact: string | null;
  guardian_consent: boolean;
  admin_notes: string | null;
  message: string | null;
  status: ApplicationStatus;
  created_at: string;
}

export interface AdminData {
  profiles: ProfileRow[];
  cars: CarRow[];
  lifts: LiftRow[];
  liftUnavailableSlots: LiftUnavailableSlotRow[];
  liftBookings: LiftBookingRow[];
  serviceBookings: ServiceBookingRow[];
  jobApplications: JobApplicationRow[];
}
