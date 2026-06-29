"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Volleyball, CalendarCheck, Clock, XCircle } from "lucide-react";
import { BookingCard } from "@/components/BookingCard";
import { Guard } from "@/components/Guard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/lib/auth";
import { bookings as allBookings } from "@/lib/data";
import type { Booking } from "@/lib/types";

const FILTERS = [
  { key: "all", label: "Semua" },
  { key: "active", label: "Aktif" },
  { key: "past", label: "Riwayat" },
] as const;

function MyBookingsInner() {
  const { user } = useAuth();
  const [list, setList] = useState<Booking[]>(() =>
    allBookings.filter((b) => b.userId === user?.id),
  );
  const [filter, setFilter] = useState<"all" | "active" | "past">("all");
  const [cancelId, setCancelId] = useState<number | null>(null);

  const stats = useMemo(() => ({
    active: list.filter((b) => ["pending_payment", "confirmed"].includes(b.status)).length,
    completed: list.filter((b) => b.status === "completed").length,
    cancelled: list.filter((b) => ["cancelled", "expired"].includes(b.status)).length,
  }), [list]);

  const shown = useMemo(
    () =>
      filter === "active"
        ? list.filter((b) => ["pending_payment", "confirmed"].includes(b.status))
        : filter === "past"
          ? list.filter((b) => ["completed", "cancelled", "expired"].includes(b.status))
          : list,
    [filter, list],
  );

  const doCancel = () => {
    setList((prev) =>
      prev.map((b) =>
        b.id === cancelId
          ? { ...b, status: "cancelled", paymentStatus: "failed", cancelledAt: new Date().toISOString() }
          : b,
      ),
    );
    setCancelId(null);
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Pesanan Saya</h1>
          <p className="text-sm text-muted">Kelola reservasi lapangan Anda</p>
        </div>
        <Link href="/courts">
          <Button size="sm">+ Pesan Lapangan</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-surface p-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary">
            <CalendarCheck className="h-4 w-4 text-on-primary" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{stats.active}</p>
            <p className="text-xs text-muted">Aktif</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-surface p-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted-surface">
            <Clock className="h-4 w-4 text-muted" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{stats.completed}</p>
            <p className="text-xs text-muted">Selesai</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-surface p-4">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted-surface">
            <XCircle className="h-4 w-4 text-muted" />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{stats.cancelled}</p>
            <p className="text-xs text-muted">Batal</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex gap-1 border-b border-black/10">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
              filter === f.key
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {shown.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={Volleyball}
          title="Belum ada pesanan"
          description={filter === "active" ? "Tidak ada reservasi aktif." : "Tidak ada riwayat."}
          action={
            <Link href="/courts">
              <Button size="sm">Cari Lapangan</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {shown.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              action={
                b.status === "pending_payment" ? (
                  <div className="flex gap-2">
                    <Link
                      href={`/booking/${b.id}/payment?court=${b.courtId}&start=${b.startTime}&end=${b.endTime}&date=${b.date}&provider=manual`}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary hover:bg-primary-hover"
                    >
                      Bayar
                    </Link>
                    <Button size="sm" variant="ghost" onClick={() => setCancelId(b.id)}>
                      Batal
                    </Button>
                  </div>
                ) : b.status === "confirmed" ? (
                  <Button size="sm" variant="ghost" onClick={() => setCancelId(b.id)}>
                    Batal
                  </Button>
                ) : null
              }
            />
          ))}
        </div>
      )}

      <Modal open={cancelId !== null} onClose={() => setCancelId(null)} title="Batalkan pesanan?">
        <p className="text-sm text-muted">Slot akan kembali tersedia untuk pemain lain.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setCancelId(null)}>Simpan</Button>
          <Button variant="danger" onClick={doCancel}>Ya, Batalkan</Button>
        </div>
      </Modal>
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <Guard>
      <MyBookingsInner />
    </Guard>
  );
}
