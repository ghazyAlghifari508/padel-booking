"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { ArrowLeft, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { durationHours, formatIDR } from "@/lib/format";
import { cn } from "@/lib/cn";

// "today" in Asia/Jakarta (WIB), not the server/UTC day — avoids off-by-one near midnight.
const todayWIB = () => new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });

function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function shortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
}

export default function CourtDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const TODAY = todayWIB();
  const [date, setDate] = useState(TODAY);
  const [picked, setPicked] = useState<{ start: string; end: string } | null>(null);
  const { data: court, loading: courtLoading, error: courtError } = useApi(() => api.court(id), [id]);
  const { data: availability } = useApi(() => api.availability(id, date), [id, date]);
  const slots = availability?.slots ?? [];

  if (courtLoading) return <p className="py-20 text-center text-sm text-muted">Memuat lapangan…</p>;
  if (courtError || !court)
    return (
      <div className="py-20 text-center">
        <p className="text-muted">Lapangan tidak ditemukan.</p>
        <Link href="/courts" className="mt-3 inline-block text-sm underline">
          Kembali
        </Link>
      </div>
    );

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
    router.push(
      `/booking/confirm?${new URLSearchParams({ court: String(court.id), date, start: picked.start, end: picked.end })}`,
    );
  };

  return (
    <div>
      <Link
        href="/courts"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Lapangan
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: info */}
        <div>
          <div className="relative aspect-video overflow-hidden rounded-xl bg-muted-surface">
            <Image
              src={court.imageUrl}
              alt={court.name}
              fill
              sizes="(min-width:1024px) 60vw, 100vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="mt-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{court.name}</h1>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                  <MapPin className="h-4 w-4" /> {court.location}
                </p>
              </div>
              <div className="rounded-xl border border-black/10 bg-surface px-4 py-2 text-right">
                <p className="text-xs text-muted">Harga sewa</p>
                <p className="text-xl font-bold text-foreground">{formatIDR(court.pricePerHour)}</p>
                <p className="text-xs text-muted">per jam</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">{court.description}</p>
          </div>

          {/* Amenities placeholder */}
          <div className="mt-6 flex flex-wrap gap-2">
            {["Parkir Gratis", "Toilet", "Mushola", "Kantin"].map((a) => (
              <span key={a} className="rounded-full border border-black/10 px-3 py-1 text-xs text-muted">
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Right: booking panel */}
        <aside className="rounded-xl border border-black/10 bg-surface lg:sticky lg:top-24 lg:self-start">
          <div className="border-b border-black/10 px-5 py-4">
            <p className="text-sm font-bold text-foreground">Pilih Tanggal & Slot</p>
          </div>

          {/* Date nav */}
          <div className="flex items-center justify-between gap-2 border-b border-black/10 px-4 py-3">
            <button
              onClick={() => { setDate((d) => addDays(d, -1)); setPicked(null); }}
              disabled={date <= TODAY}
              className="grid h-8 w-8 place-items-center rounded-lg border border-black/10 text-muted disabled:opacity-30 hover:bg-muted-surface"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex flex-1 flex-col items-center">
              <p className="text-sm font-semibold text-foreground">{shortDate(date)}</p>
              <input
                type="date"
                value={date}
                min={TODAY}
                onChange={(e) => { setDate(e.target.value); setPicked(null); }}
                aria-label="Tanggal booking"
                className="mt-0.5 cursor-pointer text-center text-xs text-primary underline underline-offset-2 focus:outline-none"
              />
            </div>
            <button
              onClick={() => { setDate((d) => addDays(d, 1)); setPicked(null); }}
              className="grid h-8 w-8 place-items-center rounded-lg border border-black/10 text-muted hover:bg-muted-surface"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Slots */}
          <div className="px-4 py-3">
            <p className="mb-2 flex items-center gap-1.5 text-xs text-muted">
              <Clock className="h-3.5 w-3.5" /> Klik slot untuk memilih rentang waktu
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {slots.map((s) => {
                const isPicked = picked && s.startTime >= picked.start && s.endTime <= picked.end;
                return (
                  <button
                    key={s.startTime}
                    disabled={!s.available}
                    aria-pressed={!!isPicked}
                    onClick={() => toggleSlot(s.startTime, s.endTime)}
                    className={cn(
                      "rounded-lg border px-1.5 py-2 text-xs font-medium transition-colors",
                      s.available && !isPicked && "border-black/10 text-foreground hover:bg-muted-surface",
                      isPicked && "border-primary bg-primary text-on-primary",
                      !s.available && "cursor-not-allowed border-transparent bg-muted-surface text-muted/50 line-through",
                    )}
                  >
                    {s.startTime}
                    {!s.available && (
                      <span className="block text-[10px] no-underline leading-tight">
                        {s.reason === "blocked" ? "blokir" : "terpesan"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t border-black/10 px-5 py-4">
            {picked ? (
              <div className="mb-4 rounded-lg bg-muted-surface px-4 py-3 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Slot dipilih</span>
                  <span className="font-medium text-foreground">{picked.start}–{picked.end}</span>
                </div>
                <div className="mt-1 flex justify-between text-muted">
                  <span>Durasi</span>
                  <span className="font-medium text-foreground">{hours} jam</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-black/10 pt-2 text-sm font-bold text-foreground">
                  <span>Total</span>
                  <span>{formatIDR(total)}</span>
                </div>
              </div>
            ) : (
              <p className="mb-4 text-center text-sm text-muted">Belum ada slot dipilih</p>
            )}
            <Button onClick={proceed} disabled={!picked} size="lg" className="w-full">
              {user ? "Lanjut Konfirmasi" : "Masuk untuk Booking"}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
