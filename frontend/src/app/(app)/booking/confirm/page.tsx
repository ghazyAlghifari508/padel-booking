"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Guard } from "@/components/Guard";
import { Button } from "@/components/ui/Button";
import { hasConflict } from "@/lib/availability";
import { useAuth } from "@/lib/auth";
import { blockedTimes, bookings, courts } from "@/lib/data";
import { durationHours, formatDate, formatIDR } from "@/lib/format";

const providers = [
  { id: "manual", name: "Transfer Bank", desc: "Admin verifikasi bukti bayar", icon: "🏦" },
  { id: "midtrans", name: "Kartu / Gateway", desc: "Pembayaran sandbox Midtrans", icon: "💳" },
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
  const [provider, setProvider] = useState<"manual" | "midtrans">("manual");
  const [loading, setLoading] = useState(false);

  if (!court || !date || !start || !end) return <EmptyBooking />;

  const hours = durationHours(start, end);
  const total = hours * court.pricePerHour;
  const conflict = hasConflict(courtId, date, start, end, blockedTimes, bookings);

  const confirm = () => {
    setLoading(true);
    setTimeout(
      () => router.push(`/booking/9001/payment?${new URLSearchParams({ court: String(courtId), date, start, end, provider })}`),
      650,
    );
  };

  return (
    <div>
      <Link
        href={`/courts/${courtId}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      {/* Step indicator */}
      <div className="mt-4 mb-6 flex items-center gap-2 text-xs text-muted">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-white text-[10px] font-bold">1</span>
        <span className="text-foreground font-medium">Pilih Lapangan</span>
        <span className="h-px flex-1 bg-black/10" />
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-on-primary text-[10px] font-bold">2</span>
        <span className="font-semibold text-foreground">Konfirmasi</span>
        <span className="h-px flex-1 bg-black/10" />
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-surface text-[10px] font-bold">3</span>
        <span>Pembayaran</span>
      </div>

      {conflict && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-black/10 bg-surface p-3 text-sm text-foreground">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          Slot sudah tidak tersedia. Pilih waktu lain.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: booking detail */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-black/10 bg-surface">
            <div className="border-b border-black/10 px-5 py-3">
              <p className="text-sm font-bold text-foreground">Detail Reservasi</p>
            </div>
            <div className="grid gap-0 divide-y divide-black/5">
              <Row label="Lapangan" value={court.name} />
              <Row label="Tanggal" value={formatDate(date)} />
              <Row label="Waktu" value={`${start} – ${end}`} />
              <Row label="Durasi" value={`${hours} jam`} />
              <Row label="Dipesan oleh" value={user?.name ?? "—"} />
              <Row label="Email" value={user?.email ?? "—"} />
            </div>
          </div>

          {/* Payment method */}
          <div className="rounded-xl border border-black/10 bg-surface">
            <div className="border-b border-black/10 px-5 py-3">
              <p className="text-sm font-bold text-foreground">Metode Pembayaran</p>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  aria-pressed={provider === p.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                    provider === p.id
                      ? "border-foreground bg-foreground text-white"
                      : "border-black/10 hover:bg-muted-surface"
                  }`}
                >
                  <span className="text-lg">{p.icon}</span>
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className={`text-xs ${provider === p.id ? "text-white/70" : "text-muted"}`}>{p.desc}</p>
                  </div>
                  {provider === p.id && (
                    <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: summary + CTA */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-black/10 bg-surface">
            <div className="relative aspect-video overflow-hidden rounded-t-xl">
              <Image src={court.imageUrl} alt={court.name} fill sizes="360px" className="object-cover" />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">Ringkasan</p>
              <div className="mt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-muted">
                  <span>{formatIDR(court.pricePerHour)} × {hours} jam</span>
                  <span>{formatIDR(total)}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between border-t border-black/10 pt-4 text-base font-bold text-foreground">
                <span>Total</span>
                <span>{formatIDR(total)}</span>
              </div>
              <Button
                onClick={confirm}
                disabled={loading || conflict}
                size="lg"
                className="mt-5 w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Membuat Pesanan…
                  </>
                ) : (
                  "Konfirmasi & Lanjut Bayar"
                )}
              </Button>
              <p className="mt-3 text-center text-xs text-muted">
                Pesanan dikunci selama 60 menit setelah konfirmasi.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function EmptyBooking() {
  return (
    <div className="mx-auto max-w-sm rounded-xl border border-black/10 bg-surface p-8 text-center">
      <AlertTriangle className="mx-auto h-10 w-10 text-muted" />
      <h1 className="mt-3 text-lg font-bold text-foreground">Belum pilih slot</h1>
      <p className="mt-2 text-sm text-muted">Pilih lapangan dan slot waktu terlebih dahulu.</p>
      <Link
        href="/courts"
        className="mt-5 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary"
      >
        Cari Lapangan
      </Link>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Guard>
      <Suspense
        fallback={
          <div className="grid py-20 place-items-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        }
      >
        <ConfirmInner />
      </Suspense>
    </Guard>
  );
}
