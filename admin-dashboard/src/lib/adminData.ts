import { supabase } from "./supabase";
import type {
  AdminData,
  ApplicationStatus,
  BookingStatus,
  LiftRow
} from "../types/admin";

function throwIfError(error: { message: string } | null) {
  if (error) {
    throw new Error(error.message);
  }
}

export async function loadAdminData(): Promise<AdminData> {
  const [
    profilesResult,
    carsResult,
    liftsResult,
    liftUnavailableSlotsResult,
    liftBookingsResult,
    serviceBookingsResult,
    jobApplicationsResult
  ] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("cars").select("*").order("created_at", { ascending: false }),
    supabase.from("lifts").select("*").order("name", { ascending: true }),
    supabase.from("lift_unavailable_slots").select("*").order("blocked_start_at", { ascending: false }),
    supabase.from("lift_bookings").select("*").order("requested_start_at", { ascending: false }),
    supabase.from("service_bookings").select("*").order("service_date", { ascending: false }),
    supabase.from("job_applications").select("*").order("created_at", { ascending: false })
  ]);

  [
    profilesResult.error,
    carsResult.error,
    liftsResult.error,
    liftUnavailableSlotsResult.error,
    liftBookingsResult.error,
    serviceBookingsResult.error,
    jobApplicationsResult.error
  ].forEach(throwIfError);

  return {
    profiles: profilesResult.data ?? [],
    cars: carsResult.data ?? [],
    lifts: liftsResult.data ?? [],
    liftUnavailableSlots: liftUnavailableSlotsResult.data ?? [],
    liftBookings: liftBookingsResult.data ?? [],
    serviceBookings: serviceBookingsResult.data ?? [],
    jobApplications: jobApplicationsResult.data ?? []
  } as AdminData;
}

export async function updateLiftBookingStatus(id: string, status: BookingStatus) {
  const { error } = await supabase
    .from("lift_bookings")
    .update({
      status,
      reviewed_at: new Date().toISOString()
    })
    .eq("id", id);

  throwIfError(error);
}

export async function updateServiceBookingStatus(id: string, status: BookingStatus) {
  const { error } = await supabase
    .from("service_bookings")
    .update({
      status,
      reviewed_at: new Date().toISOString()
    })
    .eq("id", id);

  throwIfError(error);
}

export async function updateJobApplicationStatus(id: string, status: ApplicationStatus) {
  const { error } = await supabase
    .from("job_applications")
    .update({
      status,
      reviewed_at: new Date().toISOString()
    })
    .eq("id", id);

  throwIfError(error);
}

export async function updateJobApplicationAdminNotes(id: string, adminNotes: string) {
  const { error } = await supabase
    .from("job_applications")
    .update({ admin_notes: adminNotes })
    .eq("id", id);

  throwIfError(error);
}

export async function createLift(input: {
  name: string;
  location_label?: string;
  hourly_rate?: number;
  max_vehicle_weight_kg?: number;
  description?: string;
}) {
  const { error } = await supabase.from("lifts").insert({
    name: input.name,
    location_label: input.location_label || null,
    hourly_rate: input.hourly_rate,
    max_vehicle_weight_kg: input.max_vehicle_weight_kg,
    description: input.description || null,
    is_active: true
  });

  throwIfError(error);
}

export async function updateLiftActive(lift: LiftRow, isActive: boolean) {
  const { error } = await supabase
    .from("lifts")
    .update({ is_active: isActive })
    .eq("id", lift.id);

  throwIfError(error);
}

export async function createLiftUnavailableSlot(input: {
  lift_id: string;
  blocked_start_at: string;
  blocked_end_at: string;
  reason?: string;
}) {
  const { error } = await supabase.from("lift_unavailable_slots").insert({
    lift_id: input.lift_id,
    blocked_start_at: input.blocked_start_at,
    blocked_end_at: input.blocked_end_at,
    reason: input.reason || null
  });

  throwIfError(error);
}
