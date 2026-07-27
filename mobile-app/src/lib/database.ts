import { supabase, getSupabaseEnvError } from "./supabase";
import type {
  BookingSummary,
  CarSummary,
  LiftAvailabilitySlot,
  LiftSummary,
  ServiceMenuItem
} from "../types/ui";

type BookingStatus = BookingSummary["status"];
type PaymentStatus = BookingSummary["payment_status"];

interface CarRow {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number | null;
  license_plate: string | null;
  color: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface LiftRow {
  id: string;
  name: string;
  location_label: string | null;
  hourly_rate: number | null;
  max_vehicle_weight_kg: number | null;
}

interface ServiceBookingRow {
  id: string;
  car_id: string;
  service_catalog_id: string | null;
  service_type: string;
  estimated_price: number | null;
  service_date: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  customer_notes: string | null;
  created_at: string;
}

interface ServiceCatalogRow {
  id: string;
  name: string;
  description: string | null;
  estimated_price: number | null;
  estimated_duration_minutes: number | null;
}

interface LiftBookingRow {
  id: string;
  car_id: string | null;
  lift_id: string;
  requested_start_at: string;
  requested_end_at: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  customer_notes: string | null;
  created_at: string;
}

interface BusyLiftSlotRow {
  starts_at: string;
  ends_at: string;
}

const WORKSHOP_OPEN_HOUR = 8;
const WORKSHOP_CLOSE_HOUR = 18;
const BOOKING_DURATION_HOURS = 2;

function requireEnv() {
  const envError = getSupabaseEnvError();

  if (envError) {
    throw new Error(envError);
  }
}

async function getCurrentUserId() {
  requireEnv();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Please log in first.");
  }

  return data.user.id;
}

function toCarSummary(car: CarRow): CarSummary {
  return {
    id: car.id,
    make: car.make,
    model: car.model,
    year: car.year ?? new Date().getFullYear(),
    license_plate: car.license_plate ?? "No plate saved",
    color: car.color ?? "Not specified",
    next_service: car.notes || "No service notes yet"
  };
}

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function rangesOverlap(startA: Date, endA: Date, startB: Date, endB: Date) {
  return startA < endB && endA > startB;
}

function isWorkshopDay(date: Date) {
  const day = date.getDay();
  return day >= 1 && day <= 6;
}

function formatSlotLabel(start: Date, end: Date) {
  const dateLabel = new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(start);
  const timeLabel = `${new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit"
  }).format(start)} - ${new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit"
  }).format(end)}`;

  return `${dateLabel}, ${timeLabel}`;
}

function isSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  busySlots: BusyLiftSlotRow[]
) {
  const hasConflict = busySlots.some((busySlot) => {
    return rangesOverlap(
      slotStart,
      slotEnd,
      new Date(busySlot.starts_at),
      new Date(busySlot.ends_at)
    );
  });

  return !hasConflict;
}

export async function listCars() {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as CarRow[]).map(toCarSummary);
}

export async function addCar(input: {
  make: string;
  model: string;
  year?: number;
  license_plate?: string;
  color?: string;
  notes?: string;
}) {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("cars").insert({
    user_id: userId,
    make: input.make,
    model: input.model,
    year: input.year,
    license_plate: input.license_plate || null,
    color: input.color || null,
    notes: input.notes || null
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function listLifts() {
  requireEnv();

  const { data, error } = await supabase
    .from("lifts")
    .select("id, name, location_label, hourly_rate, max_vehicle_weight_kg")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as LiftRow[]).map<LiftSummary>((lift) => ({
    id: lift.id,
    name: lift.name,
    location_label: lift.location_label ?? "Workshop",
    hourly_rate: lift.hourly_rate ?? 0,
    max_vehicle_weight_kg: lift.max_vehicle_weight_kg ?? 0
  }));
}

export async function listServiceMenu() {
  requireEnv();

  const { data, error } = await supabase
    .from("service_catalog")
    .select("id, name, description, estimated_price, estimated_duration_minutes")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ServiceCatalogRow[]).map<ServiceMenuItem>((service) => ({
    id: service.id,
    name: service.name,
    description: service.description ?? "Workshop service",
    estimated_price: service.estimated_price ?? 0,
    estimated_duration_minutes: service.estimated_duration_minutes ?? 60
  }));
}

export async function listAvailableLiftSlots(liftId: string, daysToShow = 7) {
  requireEnv();

  const rangeStart = new Date();
  rangeStart.setMinutes(0, 0, 0);
  const rangeEnd = new Date(rangeStart);
  rangeEnd.setDate(rangeEnd.getDate() + daysToShow);

  const { data, error } = await supabase.rpc("manfix_list_lift_busy_slots", {
    target_lift_id: liftId,
    range_start: rangeStart.toISOString(),
    range_end: rangeEnd.toISOString()
  });

  if (error) {
    throw new Error(error.message);
  }

  const busySlots = (data ?? []) as BusyLiftSlotRow[];
  const slots: LiftAvailabilitySlot[] = [];

  for (let dayOffset = 0; dayOffset < daysToShow; dayOffset += 1) {
    const day = new Date(rangeStart);
    day.setDate(rangeStart.getDate() + dayOffset);

    if (!isWorkshopDay(day)) {
      continue;
    }

    for (
      let hour = WORKSHOP_OPEN_HOUR;
      hour + BOOKING_DURATION_HOURS <= WORKSHOP_CLOSE_HOUR;
      hour += BOOKING_DURATION_HOURS
    ) {
      const slotStart = new Date(day);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(slotStart.getHours() + BOOKING_DURATION_HOURS);

      if (slotStart <= new Date()) {
        continue;
      }

      if (isSlotAvailable(slotStart, slotEnd, busySlots)) {
        slots.push({
          id: `${liftId}-${slotStart.toISOString()}`,
          lift_id: liftId,
          starts_at: slotStart.toISOString(),
          ends_at: slotEnd.toISOString(),
          label: formatSlotLabel(slotStart, slotEnd)
        });
      }
    }
  }

  return slots;
}

export async function createServiceBooking(input: {
  car_id: string;
  service_catalog_id?: string;
  service_type: string;
  estimated_price?: number;
  service_date: string;
  customer_notes?: string;
  photo_url?: string;
  photo_caption?: string;
}) {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("service_bookings")
    .insert({
    user_id: userId,
    car_id: input.car_id,
    service_catalog_id: input.service_catalog_id || null,
    service_type: input.service_type,
    estimated_price: input.estimated_price,
    service_date: input.service_date,
    customer_notes: input.customer_notes || null,
    status: "pending",
    payment_status: "unpaid"
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (input.photo_url?.trim()) {
    const { error: photoError } = await supabase.from("booking_photos").insert({
      uploaded_by: userId,
      service_booking_id: data.id,
      storage_path: input.photo_url.trim(),
      photo_url: input.photo_url.trim(),
      caption: input.photo_caption?.trim() || "Customer issue photo"
    });

    if (photoError) {
      throw new Error(photoError.message);
    }
  }

  return data.id;
}

export async function createLiftBooking(input: {
  car_id?: string;
  lift_id: string;
  requested_start_at: string;
  requested_end_at: string;
  customer_notes?: string;
}) {
  const userId = await getCurrentUserId();
  const availableSlots = await listAvailableLiftSlots(input.lift_id);
  const matchingSlot = availableSlots.find(
    (slot) =>
      slot.starts_at === input.requested_start_at &&
      slot.ends_at === input.requested_end_at
  );

  if (!matchingSlot) {
    throw new Error("Selected lift booking time is unavailable. Please choose another slot.");
  }

  const { data, error } = await supabase
    .from("lift_bookings")
    .insert({
      user_id: userId,
      car_id: input.car_id || null,
      lift_id: input.lift_id,
      requested_start_at: input.requested_start_at,
      requested_end_at: input.requested_end_at,
      customer_notes: input.customer_notes || null,
      status: "pending",
      payment_status: "unpaid"
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data.id;
}

export async function listUserBookings() {
  const userId = await getCurrentUserId();

  const [carsResult, liftsResult, serviceResult, liftBookingResult] = await Promise.all([
    supabase.from("cars").select("*").eq("user_id", userId),
    supabase.from("lifts").select("id, name, location_label, hourly_rate, max_vehicle_weight_kg"),
    supabase
      .from("service_bookings")
      .select("*")
      .eq("user_id", userId)
      .order("service_date", { ascending: false }),
    supabase
      .from("lift_bookings")
      .select("*")
      .eq("user_id", userId)
      .order("requested_start_at", { ascending: false })
  ]);

  const firstError =
    carsResult.error || liftsResult.error || serviceResult.error || liftBookingResult.error;

  if (firstError) {
    throw new Error(firstError.message);
  }

  const cars = new Map(
    ((carsResult.data ?? []) as CarRow[]).map((car) => [
      car.id,
      `${car.make} ${car.model}`
    ])
  );
  const lifts = new Map(
    ((liftsResult.data ?? []) as LiftRow[]).map((lift) => [lift.id, lift.name])
  );

  const serviceBookings = ((serviceResult.data ?? []) as ServiceBookingRow[])
    .filter((booking) => !["cancelled", "rejected"].includes(booking.status))
    .map<BookingSummary>((booking) => ({
      id: booking.id,
      kind: "Service",
      title: booking.service_type,
      date_label: formatDateLabel(booking.service_date),
      car_label: cars.get(booking.car_id) ?? "Saved car",
      status: booking.status,
      payment_status: booking.payment_status,
      detail: booking.customer_notes || "Service request submitted",
      estimated_price: booking.estimated_price ?? 0,
      reference_number: `MAH-SVC-${booking.id.slice(0, 6).toUpperCase()}`
    }));

  const liftBookings = ((liftBookingResult.data ?? []) as LiftBookingRow[])
    .filter((booking) => !["cancelled", "rejected"].includes(booking.status))
    .map<BookingSummary>((booking) => ({
      id: booking.id,
      kind: "Lift",
      title: `${lifts.get(booking.lift_id) ?? "Car lift"} rental`,
      date_label: formatDateLabel(booking.requested_start_at),
      car_label: booking.car_id ? cars.get(booking.car_id) ?? "Saved car" : "No car selected",
      status: booking.status,
      payment_status: booking.payment_status,
      detail: booking.customer_notes || "Lift booking request submitted",
      estimated_price: 48,
      reference_number: `MAH-LIFT-${booking.id.slice(0, 6).toUpperCase()}`
    }));

  return [...serviceBookings, ...liftBookings].sort((a, b) =>
    b.date_label.localeCompare(a.date_label)
  );
}

export async function cancelBooking(booking: BookingSummary) {
  if (booking.kind === "Application") {
    throw new Error("Job applications cannot be cancelled from the booking screen.");
  }

  const { error } = await supabase.rpc("manfix_cancel_booking", {
    booking_id: booking.id,
    booking_kind: booking.kind === "Service" ? "service" : "lift"
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function submitJobApplication(input: {
  applicant_name: string;
  age: number;
  email: string;
  phone?: string;
  available_working_days: string[];
  available_time: string;
  role_type:
    | "workshop_helper"
    | "car_wash_crew"
    | "apprentice_mechanic"
    | "content_creator"
    | "spare_parts_assistant"
    | "customer_service_helper";
  previous_experience?: string;
  reason_for_applying: string;
  emergency_contact: string;
  guardian_consent: boolean;
}) {
  const userId = await getCurrentUserId();

  const { error } = await supabase.from("job_applications").insert({
    user_id: userId,
    applicant_name: input.applicant_name,
    age: input.age,
    email: input.email,
    phone: input.phone || null,
    available_working_days: input.available_working_days,
    available_time: input.available_time,
    role_type: input.role_type,
    previous_experience: input.previous_experience || null,
    reason_for_applying: input.reason_for_applying,
    emergency_contact: input.emergency_contact,
    guardian_consent: input.guardian_consent,
    message: input.reason_for_applying,
    status: "pending"
  });

  if (error) {
    throw new Error(error.message);
  }
}
