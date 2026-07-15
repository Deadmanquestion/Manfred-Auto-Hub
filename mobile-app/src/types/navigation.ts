import type { BookingSummary, CarSummary } from "./ui";

export type ScreenName =
  | "Login"
  | "Register"
  | "Home"
  | "Booking"
  | "Vehicle"
  | "Alerts"
  | "MyCars"
  | "AddCar"
  | "BookService"
  | "BookLift"
  | "MyBookings"
  | "Jobs"
  | "JobApplication"
  | "WorkshopDetail"
  | "BookingSummary"
  | "LiftBookingSummary"
  | "ServiceBookingSummary"
  | "InvestorDashboard"
  | "Profile";

export interface ScreenProps {
  navigate: (screen: ScreenName) => void;
  goBack: () => void;
  resetToLogin: () => void;
  mockUser: MockUser | null;
  setMockUser: (user: MockUser) => void;
  cars: CarSummary[];
  bookings: BookingSummary[];
  addMockCar: (car: Omit<CarSummary, "id">) => void;
  addMockBooking: (booking: Omit<BookingSummary, "id">) => void;
}

export interface MockUser {
  fullName: string;
  email: string;
  phone?: string;
}
