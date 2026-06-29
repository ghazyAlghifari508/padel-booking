// Run: npx tsx src/lib/format.test.ts  (asserts only, no framework)
import { durationHours, overlaps, formatIDR } from "./format";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error("FAIL: " + msg);
}

// duration
assert(durationHours("19:00", "20:00") === 1, "1h");
assert(durationHours("19:00", "20:30") === 1.5, "1.5h");

// overlap (PRD AC-6.4/6.5)
assert(overlaps("19:00", "20:00", "19:30", "20:30"), "19:30-20:30 overlaps 19-20");
assert(!overlaps("19:00", "20:00", "20:00", "21:00"), "adjacent 20-21 no overlap");
assert(!overlaps("19:00", "20:00", "18:00", "19:00"), "adjacent before no overlap");

// price = pricePerHour * duration
assert(150000 * durationHours("08:00", "10:00") === 300000, "2h price");

// IDR format contains Rp
assert(formatIDR(150000).includes("Rp"), "IDR symbol");

console.log("all format.test.ts assertions passed");
