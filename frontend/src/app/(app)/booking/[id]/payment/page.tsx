"use client";

import Link from "next/link";
import { Suspense, use, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Loader2, CheckCircle2, ArrowRight } from "lucide-react";
import { Guard } from "@/components/Guard";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { durationHours, formatDate, formatIDR } from "@/lib/format";

type PayState = "idle" | "processing" | "done";

function PaymentInner({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const { data: booking, loading: bookingLoading, error: bookingError } = useApi(() => api.booking(bookingId), [bookingId]);
  const { data: payment } = useApi(() => api.payment(bookingId), [bookingId]);
  const provider = payment?.provider === "midtrans" ? "midtrans" : "manual";
  const total = booking?.totalPrice ?? 0;
  const date = booking?.date ?? "";
  const start = booking?.startTime ?? "";
  const end = booking?.endTime ?? "";
  const [state, setState] = useState<PayState>("idle");
  const [copied, setCopied] = useState(false);
  const [proof, setProof] = useState<File | null>(null);
  const [error, setError] = useState("");

  const pay = async () => {
    if (provider === "midtrans" && payment?.paymentUrl) {
      window.location.href = payment.paymentUrl;
      return;
    }
    if (!proof) return setError("Upload bukti transfer dulu.");
    setState("processing");
    setError("");
    try {
      await api.uploadPaymentProof(bookingId, proof);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload bukti gagal.");
      setState("idle");
    }
  };

  const copy = async () => {
    await navigator.clipboard?.writeText("8801234567890");
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (bookingLoading) return <p className="py-20 text-center text-sm text-muted">Memuat pembayaran…</p>;

  if (bookingError || !booking || !date || !start || !end) {
    return (
      <div className="mx-auto max-w-sm rounded-xl border border-black/10 bg-surface p-8 text-center">
        <h1 className="text-lg font-bold">Data tidak lengkap</h1>
        <Link href="/courts" className="mt-4 inline-block text-sm underline">Mulai lagi</Link>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="mx-auto max-w-md">
        <div className="rounded-xl border border-black/10 bg-surface p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary">
            <CheckCircle2 className="h-8 w-8 text-on-primary" />
          </div>
          <h1 className="mt-5 text-xl font-bold text-foreground">
            {provider === "midtrans" ? "Pembayaran Berhasil!" : "Bukti Dikirim!"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {provider === "midtrans"
              ? "Reservasi dikonfirmasi. Sampai di lapangan!"
              : "Admin akan verifikasi dalam 1×24 jam."}
          </p>

          <div className="mt-6 rounded-lg bg-muted-surface p-4 text-left text-sm">
            <div className="flex justify-between py-1 text-muted">
              <span>No. Pesanan</span>
              <span className="font-medium text-foreground">#{bookingId}</span>
            </div>
            <div className="flex justify-between py-1 text-muted">
              <span>Lapangan</span>
              <span className="font-medium text-foreground">{booking.courtName}</span>
            </div>
            <div className="flex justify-between py-1 text-muted">
              <span>Jadwal</span>
              <span className="font-medium text-foreground">{formatDate(date)} · {start}–{end}</span>
            </div>
            <div className="flex justify-between border-t border-black/10 py-1 pt-3 font-bold text-foreground">
              <span>Total</span>
              <span>{formatIDR(total)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={() => router.push("/my-bookings")} className="w-full">
              Lihat Pesanan Saya
            </Button>
            <Button variant="outline" onClick={() => router.push("/courts")} className="w-full">
              Pesan Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-6 flex items-center gap-2 text-xs text-muted">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-white text-[10px] font-bold">1</span>
        <span className="text-foreground font-medium">Pilih Lapangan</span>
        <span className="h-px flex-1 bg-black/10" />
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-white text-[10px] font-bold">2</span>
        <span className="text-foreground font-medium">Konfirmasi</span>
        <span className="h-px flex-1 bg-black/10" />
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-on-primary text-[10px] font-bold">3</span>
        <span className="font-semibold text-foreground">Pembayaran</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: booking info */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-black/10 bg-surface">
            <div className="border-b border-black/10 px-5 py-3">
              <p className="text-sm font-bold text-foreground">Detail Pesanan <span className="font-normal text-muted">#{bookingId}</span></p>
            </div>
            <div className="divide-y divide-black/5">
              <Info label="Lapangan" value={booking.courtName} />
              <Info label="Tanggal" value={formatDate(date)} />
              <Info label="Waktu" value={`${start} – ${end}`} />
              <Info label="Durasi" value={`${durationHours(start, end)} jam`} />
            </div>
          </div>

          {/* Transfer instructions */}
          {provider === "manual" ? (
            <div className="rounded-xl border border-black/10 bg-surface">
              <div className="border-b border-black/10 px-5 py-3">
                <p className="text-sm font-bold text-foreground">Instruksi Transfer</p>
              </div>
              <div className="p-5">
                <p className="text-xs text-muted">Transfer tepat ke rekening berikut:</p>
                <div className="mt-3 flex items-center justify-between rounded-lg bg-muted-surface p-4">
                  <div>
                    <p className="text-xs text-muted">BCA • a/n CourtFlow Indonesia</p>
                    <p className="mt-1 font-mono text-xl font-bold tracking-wide text-foreground">8801234567890</p>
                  </div>
                  <button
                    onClick={copy}
                    className="flex items-center gap-1.5 rounded-lg border border-black/10 bg-surface px-3 py-2 text-xs font-semibold hover:bg-muted-surface"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Tersalin" : "Salin"}
                  </button>
                </div>
                <div className="mt-4 flex flex-col gap-1.5 text-xs text-muted">
                  <p>✦ Nominal harus tepat sesuai total tagihan</p>
                  <p>✦ Upload bukti transfer JPG/PNG/PDF maksimal 5MB</p>
                  <p>✦ Verifikasi maksimal 1×24 jam hari kerja</p>
                </div>
                <label className="mt-4 block rounded-lg border border-dashed border-black/20 bg-muted-surface p-4 text-sm">
                  <span className="font-semibold text-foreground">Bukti transfer</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) => setProof(e.target.files?.[0] ?? null)}
                    className="mt-2 block w-full text-xs text-muted"
                  />
                  {proof && <span className="mt-2 block text-xs text-foreground">{proof.name}</span>}
                </label>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-black/10 bg-surface p-5">
              <p className="text-sm font-bold text-foreground">Pembayaran via Gateway</p>
              <p className="mt-2 text-sm text-muted">
                Anda akan diarahkan ke halaman Midtrans sandbox untuk menyelesaikan pembayaran.
              </p>
            </div>
          )}
        </div>

        {/* Right: payment CTA */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-black/10 bg-surface">
            {/* Total highlight */}
            <div className="rounded-t-xl bg-primary px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-on-primary/70">Total Pembayaran</p>
              <p className="mt-1 text-3xl font-bold text-on-primary">{formatIDR(total)}</p>
              <p className="mt-1 text-xs text-on-primary/70">Berlaku 60 menit</p>
            </div>

            <div className="p-5">
              <div className="mb-5 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Metode</span>
                  <span className="font-medium text-foreground">
                    {provider === "manual" ? "Transfer Bank" : "Gateway Midtrans"}
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Status</span>
                  <span className="font-medium text-yellow-600">Menunggu Pembayaran</span>
                </div>
              </div>

              {error && <p className="mb-3 text-center text-sm text-red-600">{error}</p>}
              <Button
                onClick={pay}
                disabled={state === "processing"}
                size="lg"
                className="w-full"
              >
                {state === "processing" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Memproses…
                  </>
                ) : (
                  <>
                    {provider === "manual" ? "Kirim Bukti Bayar" : "Bayar via Gateway"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="mt-3 text-center text-xs text-muted">
                Pesanan otomatis batal jika tidak dibayar dalam 60 menit.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Guard>
      <Suspense
        fallback={
          <div className="grid py-20 place-items-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        }
      >
        <PaymentInner bookingId={id} />
      </Suspense>
    </Guard>
  );
}
