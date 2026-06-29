"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Guard } from "@/components/Guard";
import { Button } from "@/components/ui/Button";
import { hasConflict } from "@/lib/availability";
import { useAuth } from "@/lib/auth";
import { blockedTimes, bookings, courts } from "@/lib/data";
import { durationHours, formatDate, formatIDR } from "@/lib/format";

const providers = [
  ["manual", "Bank transfer", "Admin verifies receipt"],
  ["midtrans", "Gateway", "Sandbox card payment"],
] as const;

function ConfirmInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const courtId = Number(sp.get("court"));
  const date = sp.get("date") ?? "";
  const start = sp.get("start") ?? "";
  const end = sp.get("end") ?? "";
  const court = courts.find((c) => c.id === courtId);
  const [provider, setProvider] = useState<(typeof providers)[number][0]>("manual");
  const [loading, setLoading] = useState(false);

  if (!court || !date || !start || !end) {
    return <EmptyBooking />;
  }

  const hours = durationHours(start, end);
  const total = hours * court.pricePerHour;
  const conflict = hasConflict(courtId, date, start, end, blockedTimes, bookings);

  const confirm = () => {
    setLoading(true);
    const newId = 9001;
    setTimeout(() => router.push(`/booking/${newId}/payment?${new URLSearchParams({ court: String(courtId), date, start, end, provider })}`), 650);
  };

  return (
    <div>
      <Link href={`/courts/${courtId}`} className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.08em] underline"><ArrowLeft className="h-4 w-4" /> Back to court</Link>
      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="border-y border-border py-8">
          <p className="text-[13px] uppercase tracking-[0.16em] text-muted">Reservation check</p>
          <h1 className="mt-4 max-w-3xl text-[56px] font-normal leading-[1.05] tracking-[-0.04em] md:text-[72px]">Lock the slot before it returns to the grid.</h1>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <Spec label="Court" value={court.name} />
            <Spec label="Date" value={formatDate(date)} />
            <Spec label="Time" value={`${start}–${end}`} />
          </div>
          {conflict && <p className="mt-5 rounded-2xl border border-border bg-foreground px-5 py-4 text-sm text-white" role="alert">Slot collision detected. Pick another time.</p>}
        </div>

        <aside className="rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-8 lg:self-start">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted-surface">
            <Image src={court.imageUrl} alt={court.name} fill sizes="420px" className="object-cover grayscale" />
          </div>
          <div className="mt-5 border-b border-border pb-5">
            <p className="text-[13px] uppercase tracking-[0.12em] text-muted">Booked by</p>
            <p className="mt-2 text-lg">{user?.name}</p>
            <p className="text-sm text-muted">{user?.email}</p>
          </div>

          <div className="mt-5">
            <p className="text-[13px] uppercase tracking-[0.12em] text-muted">Payment route</p>
            <div className="mt-3 grid gap-2">
              {providers.map(([id, name, desc]) => (
                <button key={id} type="button" onClick={() => setProvider(id)} aria-pressed={provider === id} className={`rounded-full border border-border px-5 py-4 text-left ${provider === id ? "bg-primary" : "bg-surface hover:bg-muted-surface"}`}>
                  <span className="block text-[13px] uppercase tracking-[0.08em]">{name}</span>
                  <span className="block text-sm text-muted">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 border-y border-border py-5">
            <Line label={`${hours} hour${hours > 1 ? "s" : ""}`} value={formatIDR(court.pricePerHour)} />
            <Line label="Total" value={formatIDR(total)} strong />
          </div>
          <Button onClick={confirm} disabled={loading || conflict} size="lg" className="mt-5 w-full">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating</> : "Confirm booking"}
          </Button>
        </aside>
      </section>
    </div>
  );
}

function EmptyBooking() {
  return <div className="mx-auto max-w-lg rounded-2xl border border-border p-8 text-center"><p className="text-[13px] uppercase tracking-[0.12em] text-muted">Invalid request</p><h1 className="mt-3 text-[38px] leading-tight tracking-[-0.03em]">No slot selected.</h1><Link href="/courts" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-[13px] uppercase tracking-[0.08em]">Browse courts</Link></div>;
}

function Spec({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-border p-5"><p className="text-[13px] uppercase tracking-[0.12em] text-muted">{label}</p><p className="mt-3 text-[26px] leading-tight tracking-[-0.03em]">{value}</p></div>;
}

function Line({ label, value, strong }: { label: string; value: ReactNode; strong?: boolean }) {
  return <div className={`flex justify-between ${strong ? "mt-3 text-[26px]" : "text-base text-muted"}`}><span>{label}</span><span className="text-foreground">{value}</span></div>;
}

export default function ConfirmPage() {
  return <Guard><Suspense fallback={<div className="grid py-20 place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}><ConfirmInner /></Suspense></Guard>;
}
