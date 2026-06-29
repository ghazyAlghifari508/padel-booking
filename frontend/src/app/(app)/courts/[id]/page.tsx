"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, CheckCircle2, Info, MapPin } from "lucide-react";
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

  const slots = useMemo(
    () => (court ? buildSlots(court.id, date, operatingHours, blockedTimes, bookings) : []),
    [court, date],
  );

  if (!court) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted">Court not found.</p>
        <Link href="/courts" className="mt-3 inline-block font-extrabold text-primary-hover">← Back to courts</Link>
      </div>
    );
  }

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
    const qs = new URLSearchParams({ court: String(court.id), date, start: picked.start, end: picked.end });
    router.push(`/booking/confirm?${qs.toString()}`);
  };

  return (
    <div>
      <Link href="/courts" className="inline-flex items-center gap-1.5 text-sm font-extrabold text-muted hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to courts
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="relative aspect-video overflow-hidden rounded-[28px] border border-border bg-primary-soft">
            <Image src={court.imageUrl} alt={court.name} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" priority />
            <div className="court-lines absolute inset-0 bg-linear-to-t from-foreground/45 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 rounded-full bg-accent px-4 py-2 text-sm font-extrabold text-foreground">
              {formatIDR(court.pricePerHour)} / hour
            </span>
          </div>
          <div className="mt-5 sky-card rounded-[24px] p-5">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{court.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-muted">
              <MapPin className="h-4 w-4 text-primary-hover" /> {court.location}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{court.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-extrabold">
              <span className="rounded-full bg-primary-soft px-3 py-1.5 text-primary-hover">Indoor / Outdoor ready</span>
              <span className="rounded-full bg-accent px-3 py-1.5 text-foreground">Peak hour friendly</span>
              <span className="rounded-full bg-status-confirmed-soft px-3 py-1.5 text-status-confirmed">Open 08:00–22:00</span>
            </div>
          </div>
        </div>

        <div className="sky-card rounded-[28px] p-5 lg:sticky lg:top-24 lg:self-start">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-foreground">
            <CalendarDays className="h-5 w-5 text-primary-hover" /> Select date & slot
          </h2>

          <label htmlFor="date" className="mt-4 block text-sm font-bold text-foreground">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            min={TODAY}
            onChange={(e) => { setDate(e.target.value); setPicked(null); }}
            className="mt-1.5 h-11 w-full rounded-[16px] border border-border bg-surface px-3.5 text-sm font-medium focus:border-primary-hover focus:outline-none focus:ring-4 focus:ring-accent/70"
          />

          <p className="mt-5 text-sm font-bold text-foreground">Available slots</p>
          {slots.length === 0 ? (
            <div className="mt-2 flex items-center gap-2 rounded-[16px] bg-primary-soft px-3 py-3 text-sm font-medium text-muted">
              <Info className="h-4 w-4" /> Court closed on this day.
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {slots.map((s) => {
                const isPicked = picked && s.startTime >= picked.start && s.endTime <= picked.end;
                const reason = s.reason === "blocked" ? "Blocked" : "Booked";
                return (
                  <button
                    key={s.startTime}
                    disabled={!s.available}
                    onClick={() => toggleSlot(s.startTime, s.endTime)}
                    className={cn(
                      "min-h-11 rounded-[14px] border px-2 py-2 text-xs font-extrabold transition-all",
                      !s.available && "cursor-not-allowed border-border bg-muted-surface text-muted",
                      s.available && !isPicked && "slot-available cursor-pointer text-foreground hover:border-primary-hover hover:shadow-[0_8px_18px_rgba(14,165,233,0.14)]",
                      isPicked && "slot-selected cursor-pointer",
                    )}
                    title={!s.available ? reason : "Available"}
                  >
                    <span>{s.startTime}</span>
                    {!s.available && <span className="block text-[10px] font-bold">{reason}</span>}
                  </button>
                );
              })}
            </div>
          )}
          <p className="mt-2 text-xs font-medium text-muted">Highlighter = available. Blue = selected. Unavailable slots show reason.</p>

          <div className="mt-5 rounded-[20px] border border-border bg-primary-soft p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Selected</span>
              <span className="font-extrabold text-foreground">{picked ? `${picked.start}–${picked.end} (${hours}h)` : "—"}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-muted">Total</span>
              <span className="text-2xl font-extrabold tabular-nums text-foreground">{formatIDR(total)}</span>
            </div>
          </div>

          <Button onClick={proceed} disabled={!picked} size="lg" className="mt-4 w-full">
            <CheckCircle2 className="h-4 w-4" /> {user ? "Continue to booking" : "Login to book"}
          </Button>
        </div>
      </div>
    </div>
  );
}
