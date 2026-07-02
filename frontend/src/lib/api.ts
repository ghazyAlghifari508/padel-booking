// Typed fetch client for the CourtFlow Go API.
import type {
  User, Court, Booking, Payment, BlockedTime, OperatingHour, AutomationLog, Slot,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";
const TOKEN_KEY = "courtflow_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string | null) {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  code: string;
  status: number;
  fields?: Record<string, string>;
  constructor(status: number, code: string, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { ...(opts.headers as Record<string, string>) };
  if (!(opts.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const body = await res.json().catch(() => null);

  if (!res.ok || body?.success === false) {
    const err = body?.error ?? {};
    throw new ApiError(res.status, err.code ?? "error", err.message ?? res.statusText, err.fields);
  }
  return body.data as T;
}

const get = <T>(p: string) => request<T>(p);
const post = <T>(p: string, data?: unknown) => request<T>(p, { method: "POST", body: data ? JSON.stringify(data) : undefined });
const put = <T>(p: string, data?: unknown) => request<T>(p, { method: "PUT", body: data ? JSON.stringify(data) : undefined });
const patch = <T>(p: string, data?: unknown) => request<T>(p, { method: "PATCH", body: data ? JSON.stringify(data) : undefined });
const del = <T>(p: string) => request<T>(p, { method: "DELETE" });

interface AuthResult { token: string; user: User }

export const api = {
  // Auth
  register: (d: { name: string; email: string; phone: string; password: string }) => post<AuthResult>("/auth/register", d),
  login: (d: { email: string; password: string }) => post<AuthResult>("/auth/login", d),
  me: () => get<User>("/auth/me"),

  // Public courts + availability
  courts: () => get<Court[]>("/courts"),
  court: (id: number | string) => get<Court>(`/courts/${id}`),
  availability: (id: number | string, date: string) =>
    get<{ courtId: number; date: string; slots: Slot[] }>(`/courts/${id}/availability?date=${date}`),

  // User bookings
  myBookings: () => get<Booking[]>("/bookings"),
  booking: (id: number | string) => get<Booking>(`/bookings/${id}`),
  createBooking: (d: { courtId: number; date: string; startTime: string; endTime: string }) =>
    post<Booking>("/bookings", d),
  cancelBooking: (id: number | string) => post<Booking>(`/bookings/${id}/cancel`),

  // Payments
  payment: (bookingId: number | string) => get<Payment>(`/bookings/${bookingId}/payment`),
  initPayment: (bookingId: number | string, provider: "manual" | "midtrans") =>
    post<Payment>(`/bookings/${bookingId}/payment/init`, { provider }),
  uploadPaymentProof: (bookingId: number | string, file: File) => {
    const fd = new FormData();
    fd.append("proof", file);
    return request<Payment>(`/bookings/${bookingId}/payment/proof`, { method: "POST", body: fd });
  },

  // Admin
  admin: {
    courts: () => get<Court[]>("/admin/courts"),
    createCourt: (d: Partial<Court>) => post<Court>("/admin/courts", d),
    updateCourt: (id: number, d: Partial<Court>) => put<Court>(`/admin/courts/${id}`, d),
    deactivateCourt: (id: number) => post<Court>(`/admin/courts/${id}/deactivate`),

    operatingHours: (courtId: number) => get<OperatingHour[]>(`/admin/courts/${courtId}/operating-hours`),
    setOperatingHours: (courtId: number, hours: OperatingHour[]) =>
      put<OperatingHour[]>(`/admin/courts/${courtId}/operating-hours`, { hours }),
    blockedTimes: () => get<BlockedTime[]>("/admin/blocked-times"),
    createBlocked: (d: { courtId: number; date: string; startTime: string; endTime: string; reason: string }) =>
      post<BlockedTime>("/admin/blocked-times", d),
    deleteBlocked: (id: number) => del<{ deleted: boolean }>(`/admin/blocked-times/${id}`),

    bookings: (q?: Record<string, string>) =>
      get<Booking[]>(`/admin/bookings${q && Object.keys(q).length ? "?" + new URLSearchParams(q) : ""}`),
    updateBookingStatus: (id: number, status: string) => patch<Booking>(`/admin/bookings/${id}/status`, { status }),
    markPaid: (id: number) => post<Booking>(`/admin/bookings/${id}/mark-paid`),

    payments: () => get<Payment[]>("/admin/payments"),
    dashboard: (range?: { from?: string; to?: string }) =>
      get<AdminDashboard>(`/admin/dashboard${range?.from ? `?from=${range.from}&to=${range.to}` : ""}`),
    reports: (range?: { from?: string; to?: string }) =>
      get<AdminReports>(`/admin/reports${range?.from ? `?from=${range.from}&to=${range.to}` : ""}`),
    logs: (q?: Record<string, string>) =>
      get<AutomationLog[]>(`/admin/logs${q && Object.keys(q).length ? "?" + new URLSearchParams(q) : ""}`),
  },
};

export interface AdminDashboard {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  expiredBookings: number;
  completedBookings: number;
  totalRevenue: number;
  latestBookings: Booking[];
}

export interface AdminReports {
  from: string;
  to: string;
  totalRevenue: number;
  courts: { courtId: number; courtName: string; bookings: number; revenue: number }[];
}
