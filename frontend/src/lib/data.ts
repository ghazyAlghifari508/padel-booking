// Dummy data — no backend. All in-memory, seeded constants.
import type {
  User,
  Court,
  Booking,
  Payment,
  OperatingHour,
  BlockedTime,
  AutomationLog,
} from "./types";

export const users: User[] = [
  { id: 1, name: "Andi Pratama", email: "andi@mail.com", phone: "0812-1111-2222", role: "user" },
  { id: 2, name: "Bunga Lestari", email: "bunga@mail.com", phone: "0813-3333-4444", role: "user" },
  { id: 3, name: "Citra Dewi", email: "citra@mail.com", phone: "0814-5555-6666", role: "user" },
  { id: 99, name: "Admin CourtFlow", email: "admin@courtflow.id", phone: "0811-0000-0000", role: "admin" },
];

// Unsplash padel/tennis court imagery
const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

export const courts: Court[] = [
  {
    id: 1,
    name: "Court Emerald A",
    description: "Indoor premium court with panoramic glass walls and pro-grade turf.",
    location: "CourtFlow Arena, Jakarta Selatan",
    pricePerHour: 180000,
    imageUrl: img("photo-1554068865-24cecd4e34b8"),
    status: "active",
  },
  {
    id: 2,
    name: "Court Emerald B",
    description: "Indoor court with LED lighting, ideal for evening matches.",
    location: "CourtFlow Arena, Jakarta Selatan",
    pricePerHour: 160000,
    imageUrl: img("photo-1622279457486-62dcc4a431d6"),
    status: "active",
  },
  {
    id: 3,
    name: "Court Lime Outdoor",
    description: "Open-air court surrounded by greenery. Best in the morning.",
    location: "CourtFlow Garden, Depok",
    pricePerHour: 120000,
    imageUrl: img("photo-1611251126118-b66bb2818b94"),
    status: "active",
  },
  {
    id: 4,
    name: "Court Slate Pro",
    description: "Tournament-spec court with stadium seating.",
    location: "CourtFlow Arena, Jakarta Selatan",
    pricePerHour: 220000,
    imageUrl: img("photo-1626224583764-f87db24ac4ea"),
    status: "active",
  },
  {
    id: 5,
    name: "Court Carbon Indoor",
    description: "Climate-controlled indoor court with shock-absorbing flooring.",
    location: "CourtFlow Arena, Jakarta Selatan",
    pricePerHour: 200000,
    imageUrl: img("photo-1558618666-fcd25c85f82e"),
    status: "active",
  },
  {
    id: 6,
    name: "Court Voltage VIP",
    description: "Exclusive VIP court with private lounge and premium amenities.",
    location: "CourtFlow Arena, Jakarta Selatan",
    pricePerHour: 280000,
    imageUrl: img("photo-1599474924187-334a4ae5bd3c"),
    status: "active",
  },
  {
    id: 7,
    name: "Court Legacy (Retired)",
    description: "Older court kept for historical booking records.",
    location: "CourtFlow Arena, Jakarta Selatan",
    pricePerHour: 90000,
    imageUrl: img("photo-1595435934249-5df7ed86e1c0"),
    status: "inactive",
  },
];

// Operating hours: all active courts open Mon-Sun 08:00-22:00, court 3 closed Monday.
export const operatingHours: OperatingHour[] = courts.flatMap((c) =>
  Array.from({ length: 7 }, (_, dow) => ({
    courtId: c.id,
    dayOfWeek: dow,
    openTime: "08:00",
    closeTime: "22:00",
    closed: c.id === 3 && dow === 1, // Court Lime closed Mondays
  })),
);

// Fixed "today" anchor so dummy data is deterministic (Asia/Jakarta).
export const TODAY = "2026-07-01";
const D = (offset: number) => {
  const base = new Date(`${TODAY}T00:00:00+07:00`);
  base.setDate(base.getDate() + offset);
  return base.toISOString().slice(0, 10);
};

export const blockedTimes: BlockedTime[] = [
  {
    id: 1,
    courtId: 1,
    courtName: "Court Emerald A",
    date: D(0),
    startTime: "12:00",
    endTime: "14:00",
    reason: "Scheduled maintenance",
  },
  {
    id: 2,
    courtId: 4,
    courtName: "Court Slate Pro",
    date: D(1),
    startTime: "18:00",
    endTime: "22:00",
    reason: "Private tournament",
  },
];

export const bookings: Booking[] = [
  {
    id: 1001,
    userId: 1,
    userName: "Andi Pratama",
    userEmail: "andi@mail.com",
    courtId: 1,
    courtName: "Court Emerald A",
    date: D(0),
    startTime: "19:00",
    endTime: "20:00",
    status: "confirmed",
    paymentStatus: "paid",
    totalPrice: 180000,
    createdAt: `${D(-2)}T10:12:00+07:00`,
    updatedAt: `${D(-2)}T10:30:00+07:00`,
  },
  {
    id: 1002,
    userId: 1,
    userName: "Andi Pratama",
    userEmail: "andi@mail.com",
    courtId: 3,
    courtName: "Court Lime Outdoor",
    date: D(2),
    startTime: "08:00",
    endTime: "09:30",
    status: "pending_payment",
    paymentStatus: "pending",
    totalPrice: 180000,
    createdAt: `${D(0)}T09:00:00+07:00`,
    updatedAt: `${D(0)}T09:00:00+07:00`,
  },
  {
    id: 1003,
    userId: 2,
    userName: "Bunga Lestari",
    userEmail: "bunga@mail.com",
    courtId: 2,
    courtName: "Court Emerald B",
    date: D(1),
    startTime: "17:00",
    endTime: "18:00",
    status: "confirmed",
    paymentStatus: "paid",
    totalPrice: 160000,
    createdAt: `${D(-1)}T14:00:00+07:00`,
    updatedAt: `${D(-1)}T14:20:00+07:00`,
  },
  {
    id: 1004,
    userId: 2,
    userName: "Bunga Lestari",
    userEmail: "bunga@mail.com",
    courtId: 4,
    courtName: "Court Slate Pro",
    date: D(-3),
    startTime: "20:00",
    endTime: "21:00",
    status: "completed",
    paymentStatus: "paid",
    totalPrice: 220000,
    createdAt: `${D(-5)}T11:00:00+07:00`,
    updatedAt: `${D(-3)}T21:00:00+07:00`,
  },
  {
    id: 1005,
    userId: 3,
    userName: "Citra Dewi",
    userEmail: "citra@mail.com",
    courtId: 1,
    courtName: "Court Emerald A",
    date: D(-1),
    startTime: "10:00",
    endTime: "11:00",
    status: "cancelled",
    paymentStatus: "failed",
    totalPrice: 180000,
    createdAt: `${D(-2)}T08:00:00+07:00`,
    updatedAt: `${D(-1)}T09:00:00+07:00`,
    cancelledAt: `${D(-1)}T09:00:00+07:00`,
  },
  {
    id: 1006,
    userId: 3,
    userName: "Citra Dewi",
    userEmail: "citra@mail.com",
    courtId: 2,
    courtName: "Court Emerald B",
    date: D(-4),
    startTime: "16:00",
    endTime: "17:00",
    status: "expired",
    paymentStatus: "expired",
    totalPrice: 160000,
    createdAt: `${D(-5)}T16:00:00+07:00`,
    updatedAt: `${D(-4)}T16:00:00+07:00`,
  },
  {
    id: 1007,
    userId: 1,
    userName: "Andi Pratama",
    userEmail: "andi@mail.com",
    courtId: 2,
    courtName: "Court Emerald B",
    date: D(3),
    startTime: "20:00",
    endTime: "21:30",
    status: "confirmed",
    paymentStatus: "paid",
    totalPrice: 240000,
    createdAt: `${D(0)}T20:00:00+07:00`,
    updatedAt: `${D(0)}T20:15:00+07:00`,
  },
];

export const payments: Payment[] = bookings
  .filter((b) => b.paymentStatus !== "unpaid")
  .map((b, i) => ({
    id: 2001 + i,
    bookingId: b.id,
    amount: b.totalPrice,
    provider: b.id % 2 === 0 ? "midtrans" : "manual",
    status: b.paymentStatus,
    paymentUrl: b.paymentStatus === "pending" ? "https://app.sandbox.midtrans.com/snap/v3/redirection/demo" : undefined,
    reference: `INV-${b.id}`,
    createdAt: b.createdAt,
  }));

export const automationLogs: AutomationLog[] = [
  {
    id: 3001,
    workflowName: "Booking Created Notification",
    eventType: "booking_created",
    status: "success",
    message: "Telegram admin notified + appended to Google Sheets.",
    bookingId: 1002,
    executedAt: `${D(0)}T09:00:05+07:00`,
  },
  {
    id: 3002,
    workflowName: "Booking Confirmed Automation",
    eventType: "booking_confirmed",
    status: "success",
    message: "Confirmation email sent + Google Calendar event created.",
    bookingId: 1001,
    executedAt: `${D(-2)}T10:30:10+07:00`,
  },
  {
    id: 3003,
    workflowName: "Booking Cancelled Automation",
    eventType: "booking_cancelled",
    status: "failed",
    message: "SMTP timeout: could not send cancellation email to citra@mail.com.",
    bookingId: 1005,
    executedAt: `${D(-1)}T09:00:30+07:00`,
  },
  {
    id: 3004,
    workflowName: "Booking Confirmed Automation",
    eventType: "booking_confirmed",
    status: "success",
    message: "Confirmation email sent + Telegram admin notified.",
    bookingId: 1003,
    executedAt: `${D(-1)}T14:20:08+07:00`,
  },
];
