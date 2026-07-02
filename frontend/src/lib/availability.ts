// Slot/availability calculation (PRD §4-5). Pure helpers for UI-side checks.
import type { Booking, BlockedTime, OperatingHour, Slot } from "./types";
import { overlaps } from "./format";

const ACTIVE: Booking["status"][] = ["pending_payment", "confirmed"];

// Build hourly slots for a court+date from operating hours, blocked time, active bookings.
export function buildSlots(
  courtId: number,
  date: string,
  hours: OperatingHour[],
  blocked: BlockedTime[],
  bookings: Booking[],
): Slot[] {
  const dow = new Date(`${date}T00:00:00+07:00`).getDay();
  const oh = hours.find((h) => h.courtId === courtId && h.dayOfWeek === dow);
  if (!oh || oh.closed) return [];

  const open = parseInt(oh.openTime.slice(0, 2), 10);
  const close = parseInt(oh.closeTime.slice(0, 2), 10);

  const dayBlocked = blocked.filter((b) => b.courtId === courtId && b.date === date);
  const dayBookings = bookings.filter(
    (b) => b.courtId === courtId && b.date === date && ACTIVE.includes(b.status),
  );

  const slots: Slot[] = [];
  for (let h = open; h < close; h++) {
    const start = `${String(h).padStart(2, "0")}:00`;
    const end = `${String(h + 1).padStart(2, "0")}:00`;

    const isBooked = dayBookings.some((b) => overlaps(b.startTime, b.endTime, start, end));
    const isBlocked = dayBlocked.some((b) => overlaps(b.startTime, b.endTime, start, end));

    slots.push({
      startTime: start,
      endTime: end,
      available: !isBooked && !isBlocked,
      reason: isBooked ? "booked" : isBlocked ? "blocked" : undefined,
    });
  }
  return slots;
}

// Backend-style final check (PRD AC-6.6): does a proposed range collide?
export function hasConflict(
  courtId: number,
  date: string,
  start: string,
  end: string,
  blocked: BlockedTime[],
  bookings: Booking[],
): boolean {
  const b = blocked.some(
    (x) => x.courtId === courtId && x.date === date && overlaps(x.startTime, x.endTime, start, end),
  );
  const k = bookings.some(
    (x) =>
      x.courtId === courtId &&
      x.date === date &&
      ACTIVE.includes(x.status) &&
      overlaps(x.startTime, x.endTime, start, end),
  );
  return b || k;
}
