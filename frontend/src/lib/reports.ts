// Reporting calcs over dummy bookings (PRD §12-13).
import type { Booking } from "./types";

export function revenue(list: Booking[]): number {
  // paid revenue only (AC-12.5): exclude cancelled/expired
  return list
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalPrice, 0);
}

export function countByStatus(list: Booking[]) {
  return list.reduce(
    (acc, b) => {
      acc[b.status] = (acc[b.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

// Court usage count (AC-12.4) — confirmed/completed only
export function courtUsage(list: Booking[]) {
  const map = new Map<string, number>();
  list
    .filter((b) => ["confirmed", "completed"].includes(b.status))
    .forEach((b) => map.set(b.courtName, (map.get(b.courtName) ?? 0) + 1));
  return [...map.entries()].map(([court, count]) => ({ court, count }));
}

// Bookings grouped by date (AC-13.2)
export function byDate(list: Booking[]) {
  const map = new Map<string, { count: number; revenue: number }>();
  list.forEach((b) => {
    const cur = map.get(b.date) ?? { count: 0, revenue: 0 };
    cur.count += 1;
    if (b.paymentStatus === "paid") cur.revenue += b.totalPrice;
    map.set(b.date, cur);
  });
  return [...map.entries()]
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
