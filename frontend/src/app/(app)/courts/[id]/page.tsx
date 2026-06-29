"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";
import { buildSlots } from "@/lib/availability";
import { blockedTimes, bookings, courts, operatingHours, TODAY } from "@/lib/data";
import { durationHours, formatIDR } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function CourtDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const court = courts.find((c) => c.id === Number(id));
  const [date, setDate] = useState(TODAY);
  const [picked, setPicked] = useState<{ start: string; end: string } | null>(null);
  const slots = useMemo(() => (court ? buildSlots(court.id, date, operatingHours, blockedTimes, bookings) : []), [court, date]);

  if (!court) return <div className="py-20 text-center"><p className="text-muted">Court not found.</p><Link href="/courts" className="mt-3 inline-block underline">Back to courts</Link></div>;

  const toggleSlot = (start: string, end: string) => {
    if (!picked) return setPicked({ start, end });
    if (picked.start === start) return setPicked(null);
    if (start === picked.end) return setPicked({ ...picked, end });
    if (end === picked.start) return setPicked({ ...picked, start });
    setPicked({ start, end });
  };
  const hours = picked ? durationHours(picked.start, picked.end) : 0;
  const total = hours * court.pricePerHour;
  const proceed = () => {
    if (!picked) return;
    if (!user) return router.push("/login");
    router.push(`/booking/confirm?${new URLSearchParams({ court: String(court.id), date, start: picked.start, end: picked.end })}`);
  };

  return (
    <div>
      <Link href="/courts" className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.08em] underline"><ArrowLeft className="h-4 w-4" /> Back</Link>
      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted-surface"><Image src={court.imageUrl} alt={court.name} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover grayscale" priority /></div>
          <div className="mt-6 grid gap-6 border-b border-border pb-8 md:grid-cols-[1fr_220px]">
            <div><p className="text-[13px] uppercase tracking-[0.12em] text-muted">Court detail</p><h1 className="mt-3 text-[56px] font-normal leading-[1.05] tracking-[-0.04em]">{court.name}</h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{court.description}</p></div>
            <div className="rounded-2xl border border-border p-5"><p className="text-[13px] uppercase tracking-[0.08em] text-muted">Price</p><p className="mt-4 text-[32px] tracking-[-0.02em]">{formatIDR(court.pricePerHour)}</p><p className="mt-2 text-[13px] text-muted">per hour</p></div>
          </div>
        </div>
        <aside className="rounded-2xl border border-border p-5 lg:sticky lg:top-8 lg:self-start">
          <p className="text-[13px] uppercase tracking-[0.12em] text-muted">Book slot</p>
          <input aria-label="Booking date" type="date" value={date} min={TODAY} onChange={(e) => { setDate(e.target.value); setPicked(null); }} className="mt-5 h-12 w-full rounded-full border border-border px-5 focus:border-2 focus:outline-none" />
          <div className="mt-5 grid grid-cols-3 gap-2">
            {slots.map((s) => {
              const isPicked = picked && s.startTime >= picked.start && s.endTime <= picked.end;
              return <button key={s.startTime} disabled={!s.available} aria-pressed={!!isPicked} onClick={() => toggleSlot(s.startTime, s.endTime)} className={cn("min-h-12 rounded-full border border-border px-2 text-[13px]", s.available && !isPicked && "slot-available", isPicked && "slot-selected", !s.available && "cursor-not-allowed bg-muted-surface text-muted")}>{s.startTime}{!s.available && <span className="block text-[10px]">{s.reason === "blocked" ? "BLOCK" : "BOOKED"}</span>}</button>;
            })}
          </div>
          <div className="mt-6 border-y border-border py-5"><div className="flex justify-between text-base"><span className="text-muted">Selected</span><span>{picked ? `${picked.start}–${picked.end}` : "—"}</span></div><div className="mt-3 flex justify-between text-[26px]"><span>Total</span><span>{formatIDR(total)}</span></div></div>
          <Button onClick={proceed} disabled={!picked} size="lg" className="mt-5 w-full">{user ? "Continue" : "Login to book"}</Button>
        </aside>
      </section>
    </div>
  );
}
