"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Volleyball } from "lucide-react";
import { BookingCard } from "@/components/BookingCard";
import { Guard } from "@/components/Guard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/lib/auth";
import { bookings as allBookings } from "@/lib/data";
import type { Booking } from "@/lib/types";

const filters = ["all", "active", "past"] as const;
function MyBookingsInner() {
  const { user } = useAuth();
  const [list, setList] = useState<Booking[]>(() => allBookings.filter((b) => b.userId === user?.id));
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const [cancelId, setCancelId] = useState<number | null>(null);
  const shown = useMemo(() => filter === "active" ? list.filter((b) => ["pending_payment", "confirmed"].includes(b.status)) : filter === "past" ? list.filter((b) => ["completed", "cancelled", "expired"].includes(b.status)) : list, [filter, list]);
  const doCancel = () => { setList((prev) => prev.map((b) => b.id === cancelId ? { ...b, status: "cancelled", paymentStatus: "failed", cancelledAt: new Date().toISOString() } : b)); setCancelId(null); };
  return <div><section className="border-b border-border pb-8"><p className="text-[13px] uppercase tracking-[0.12em] text-muted">Reservation archive</p><h1 className="mt-4 text-[56px] font-normal leading-[1.05] tracking-[-0.04em]">Bookings, receipts, and match times.</h1><div className="mt-8 flex flex-wrap gap-2" role="tablist">{filters.map((f) => <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={`rounded-full border border-border px-5 py-3 text-[13px] uppercase tracking-[0.08em] ${filter === f ? "bg-primary" : "bg-surface"}`}>{f}</button>)}</div></section>{shown.length === 0 ? <EmptyState className="mt-8" icon={Volleyball} title="No bookings" description="Start with the court catalog." action={<Link href="/courts"><Button>Browse courts</Button></Link>} /> : <section className="mt-8 grid gap-5 lg:grid-cols-2">{shown.map((b) => <BookingCard key={b.id} booking={b} action={b.status === "pending_payment" ? <div className="flex gap-2"><Link href={`/booking/${b.id}/payment?court=${b.courtId}&start=${b.startTime}&end=${b.endTime}&date=${b.date}&provider=manual`} className="rounded-full bg-primary px-4 py-2 text-[13px] uppercase tracking-[0.08em]">Pay</Link><Button size="sm" variant="outline" onClick={() => setCancelId(b.id)}>Cancel</Button></div> : b.status === "confirmed" ? <Button size="sm" variant="outline" onClick={() => setCancelId(b.id)}>Cancel</Button> : null} />)}</section>}<Modal open={cancelId !== null} onClose={() => setCancelId(null)} title="Cancel booking?"><p className="text-base text-muted">This frees the slot for another player.</p><div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => setCancelId(null)}>Keep</Button><Button variant="secondary" onClick={doCancel}>Cancel booking</Button></div></Modal></div>;
}
export default function MyBookingsPage() { return <Guard><MyBookingsInner /></Guard>; }
