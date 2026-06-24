export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type BookingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed";

export type UserRole = "customer" | "admin" | "mechanic";

export type JobApplicationStatus = "pending" | "interview" | "approved" | "rejected";

export type ApplicationRole =
  | "workshop_helper"
  | "car_wash_crew"
  | "apprentice_mechanic"
  | "content_creator"
  | "spare_parts_assistant"
  | "customer_service_helper";

export interface CustomerProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year?: number;
  license_plate?: string;
  vin?: string;
  color?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Lift {
  id: string;
  name: string;
  description?: string;
  location_label?: string;
  hourly_rate?: number;
  max_vehicle_weight_kg?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceCatalogItem {
  id: string;
  name: string;
  description?: string;
  estimated_price: number;
  estimated_duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceBooking {
  id: string;
  user_id: string;
  car_id: string;
  mechanic_id?: string;
  service_catalog_id?: string;
  service_type: string;
  estimated_price?: number;
  service_date: string;
  customer_notes?: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LiftBooking {
  id: string;
  user_id: string;
  car_id?: string;
  lift_id: string;
  requested_start_at: string;
  requested_end_at: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  customer_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Mechanic {
  id: string;
  profile_id: string;
  display_name: string;
  specialties: string[];
  bio?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  applicant_name: string;
  age: number;
  email: string;
  phone?: string;
  available_working_days: string[];
  available_time: string;
  role_type: ApplicationRole;
  previous_experience?: string;
  reason_for_applying: string;
  emergency_contact: string;
  guardian_consent: boolean;
  admin_notes?: string;
  status: JobApplicationStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingPhoto {
  id: string;
  uploaded_by?: string;
  service_booking_id?: string;
  lift_booking_id?: string;
  storage_path: string;
  photo_url?: string;
  caption?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminNote {
  id: string;
  author_id: string;
  profile_id?: string;
  car_id?: string;
  lift_booking_id?: string;
  service_booking_id?: string;
  job_application_id?: string;
  mechanic_id?: string;
  note_text: string;
  created_at: string;
  updated_at: string;
}
