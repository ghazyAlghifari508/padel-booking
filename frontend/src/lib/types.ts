// Domain types — mirror PRD entities. Frontend-only, dummy data.

export type Role = "user" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
}

export type CourtStatus = "active" | "inactive";

export interface Court {
  id: number;
  name: string;
  description: string;
  location: string;
  pricePerHour: number; // IDR
  imageUrl: string;
  status: CourtStatus;
}

// Booking status flow (AGENTS.md): pending_payment -> confirmed -> completed | cancelled | expired
export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "expired";

export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "expired";
export type PaymentProvider = "manual" | "midtrans";

export interface Booking {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  courtId: number;
  courtName: string;
  date: string; // YYYY-MM-DD (Asia/Jakarta)
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number; // IDR = pricePerHour * durationHours
  createdAt: string; // ISO
  updatedAt: string; // ISO
  cancelledAt?: string; // ISO
}

export interface Payment {
  id: number;
  bookingId: number;
  amount: number; // IDR, must match booking.totalPrice
  provider: PaymentProvider;
  status: PaymentStatus;
  paymentUrl?: string;
  reference?: string;
  createdAt: string;
}

// Operating hours per court per weekday (0=Sun .. 6=Sat)
export interface OperatingHour {
  courtId: number;
  dayOfWeek: number;
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  closed: boolean;
}

export interface BlockedTime {
  id: number;
  courtId: number;
  courtName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  reason: string;
}

export type AutomationEvent =
  | "booking_created"
  | "booking_confirmed"
  | "booking_cancelled";
export type AutomationStatus = "success" | "failed";

export interface AutomationLog {
  id: number;
  workflowName: string;
  eventType: AutomationEvent;
  status: AutomationStatus;
  message: string;
  bookingId?: number;
  executedAt: string; // ISO
}

// A computed availability slot for the booking flow
export interface Slot {
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  available: boolean;
  reason?: "booked" | "blocked" | "outside_hours";
}
