"use client";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, Loader2, MapPin, ShieldCheck } from "lucide-react";
import { Guard } from "@/components/Guard";
import { Button } from "@/components/ui/Button";
import { hasConflict } from "@/lib/availability";
import { useAuth } from "@/lib/auth";
import { blockedTimes, bookings, courts } from "@/lib/data";
import { durationHours, formatDate, formatIDR } from "@/lib/format";

function ConfirmInner() {
  const sp = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const courtId = Number(sp.get("court"));
  const date = sp.get("date") ?? "";
  const start = sp.get("start") ?? "";
  const end = sp.get("end") ?? "";
  const court = courts.find((c) => c.id === courtId);
  const [provider, setProvider] = useState<"manual" | "midtrans">("manual");
  const [loading, setLoading] = useState(false);

  if (!court || !start || !end) {
    return <div className="py-20 text-center"><p className="text-muted">Invalid booking request.</p><Link href="/courts" className="mt-3 inline-block font-extrabold text-primary-hover">← Back to courts</Link></div>;
  }

  const hours = durationHours(start, end);
  const total = hours * court.pricePerHour;
  const conflict = hasConflict(courtId, date, start, end, blockedTimes, bookings);

  const confirm = () => {
    setLoading(true);
    const newId = 9000 + Math.floor(Date.now() % 1000);
    setTimeout(() => router.push(`/booking/${newId}/payment?court=${courtId}&date=${date}&start=${start}&end=${end}&provider=${provider}`), 700);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={`/courts/${courtId}`} className="inline-flex items-center gap-1.5 text-sm font-extrabold text-muted hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">Confirm your booking</h1>
      <p className="mt-1 text-sm font-medium text-muted">One last check before payment.</p>

      <div className="mt-6 overflow-hidden rounded-[28px] border border-border bg-surface shadow-[0_12px_30px_rgba(14,165,233,0.08)]">
        <div className="court-lines flex gap-4 border-b border-border bg-primary-soft p-5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[18px]">
            <Image src={court.imageUrl} alt={court.name} fill sizes="80px" className="object-cover" />
          </div>
          <div>
            <h2 className="font-extrabold text-foreground">{court.name}</h2>
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-muted"><MapPin className="h-3.5 w-3.5" /> {court.location}</p>
            <p className="mt-2 inline-flex rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-foreground">{formatIDR(court.pricePerHour)}/hr</p>
          </div>
        </div>

        <dl className="divide-y divide-border">
          <Row icon={<CalendarDays className="h-4 w-4" />} label="Date" value={formatDate(date)} />
          <Row icon={<Clock className="h-4 w-4" />} label="Time" value={`${start} – ${end} (${hours}h)`} />
          <Row label="Booked by" value={`${user?.name} · ${user?.email}`} />
        </dl>

        <div className="border-t border-border p-5">
          <p className="text-sm font-extrabold text-foreground">Payment method</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(["manual", "midtrans"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className={`cursor-pointer rounded-[20px] border p-3 text-left text-sm transition-colors ${provider === p ? "border-primary-hover bg-primary-soft ring-4 ring-accent/50" : "border-border hover:bg-primary-soft"}`}
              >
                <span className="font-extrabold capitalize text-foreground">{p === "manual" ? "Manual Transfer" : "Midtrans"}</span>
                <span className="mt-0.5 block text-xs font-medium text-muted">{p === "manual" ? "Pay & verify with admin" : "Pay via gateway (sandbox)"}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-accent/70 p-5">
          <span className="text-sm font-bold text-foreground">Total</span>
          <span className="text-2xl font-extrabold tabular-nums text-foreground">{formatIDR(total)}</span>
        </div>
      </div>

      {conflict && <p className="mt-4 rounded-[18px] bg-status-cancelled-soft px-4 py-3 text-sm font-bold text-status-cancelled" role="alert">This slot is no longer available. Pick another slot.</p>}
      <Button onClick={confirm} disabled={loading || conflict} size="lg" className="mt-5 w-full">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating booking…</> : <><ShieldCheck className="h-4 w-4" /> Confirm & proceed to payment</>}
      </Button>
      <p className="mt-3 text-center text-xs text-muted">Booking starts as <strong>pending payment</strong> until paid/verified.</p>
    </div>
  );
}

function Row({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center justify-between px-5 py-3.5"><dt className="flex items-center gap-2 text-sm font-medium text-muted">{icon} {label}</dt><dd className="text-right text-sm font-extrabold text-foreground">{value}</dd></div>;
}

export default function ConfirmPage() {
  return <Guard><Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary-hover" /></div>}><ConfirmInner /></Suspense></Guard>;
}
