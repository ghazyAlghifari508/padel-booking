"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarX2, Volleyball } from "lucide-react";
import { BookingCard } from "@/components/BookingCard";
import { Guard } from "@/components/Guard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/lib/auth";
import { bookings as allBookings } from "@/lib/data";
import type { Booking } from "@/lib/types";
import { cn } from "@/lib/cn";

const tabs = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "past", label: "Past" },
] as const;

function MyBookingsInner() {
  const { user } = useAuth();
  const [list, setList] = useState<Booking[]>(() => allBookings.filter((b) => b.userId === user?.id));
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("all");
  const [cancelId, setCancelId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (tab === "active") return list.filter((b) => ["pending_payment", "confirmed"].includes(b.status));
    if (tab === "past") return list.filter((b) => ["completed", "cancelled", "expired"].includes(b.status));
    return list;
  }, [list, tab]);

  const doCancel = () => {
    setList((prev) => prev.map((b) => b.id === cancelId ? { ...b, status: "cancelled", paymentStatus: "failed", cancelledAt: new Date().toISOString() } : b));
    setCancelId(null);
  };

  return (
    <div>
      <div className="court-lines rounded-[28px] border border-border bg-surface p-5 shadow-[0_12px_30px_rgba(14,165,233,0.08)]">
        <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-foreground">Your reservations</span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">My Bookings</h1>
        <p className="mt-1 text-sm font-medium text-muted">Manage reservations, {user?.name?.split(" ")[0]}.</p>
      </div>

      <div className="mt-5 inline-flex rounded-full border border-border bg-surface p-1 shadow-[0_10px_24px_rgba(14,165,233,0.08)]">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn("cursor-pointer rounded-full px-4 py-2 text-sm font-extrabold transition-colors", tab === t.key ? "bg-primary text-on-primary" : "text-muted hover:bg-primary-soft hover:text-foreground")}>{t.label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState className="mt-6" icon={tab === "past" ? CalendarX2 : Volleyball} title="No bookings here" description={tab === "all" ? "You haven’t booked any court yet." : `No ${tab} bookings.`} action={<Link href="/courts"><Button>Browse courts</Button></Link>} />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {filtered.map((b) => (
            <BookingCard key={b.id} booking={b} action={b.status === "pending_payment" ? <div className="flex gap-2"><Link href={`/booking/${b.id}/payment?court=${b.courtId}&start=${b.startTime}&end=${b.endTime}&date=${b.date}&provider=manual`}><Button size="sm">Pay now</Button></Link><Button size="sm" variant="outline" onClick={() => setCancelId(b.id)}>Cancel</Button></div> : b.status === "confirmed" ? <Button size="sm" variant="outline" onClick={() => setCancelId(b.id)}>Cancel</Button> : null} />
          ))}
        </div>
      )}

      <Modal open={cancelId !== null} onClose={() => setCancelId(null)} title="Cancel booking?">
        <p className="text-sm font-medium text-muted">This will cancel booking #{cancelId} and free the slot. This action cannot be undone.</p>
        <div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => setCancelId(null)}>Keep booking</Button><Button variant="danger" onClick={doCancel}>Yes, cancel</Button></div>
      </Modal>
    </div>
  );
}

export default function MyBookingsPage() {
  return <Guard><MyBookingsInner /></Guard>;
}
