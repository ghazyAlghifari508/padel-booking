"use client";
import { useMemo, useState } from "react";
import { Ban, Check, Search, X } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { bookings as seed, courts } from "@/lib/data";
import { formatDate, formatIDR } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/types";

export default function AdminBookingsPage() {
  const [list, setList] = useState<Booking[]>(seed);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [court, setCourt] = useState<string>("all");
  const [confirm, setConfirm] = useState<{ id: number; action: "cancel" | "reject" } | null>(null);

  const filtered = useMemo(
    () => list.filter((b) => {
      if (status !== "all" && b.status !== status) return false;
      if (court !== "all" && b.courtId !== Number(court)) return false;
      if (q && !`${b.userName} ${b.courtName} ${b.id}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    }),
    [list, q, status, court],
  );

  const setStatusOf = (id: number, s: BookingStatus, pay?: Booking["paymentStatus"]) =>
    setList((prev) => prev.map((b) => b.id === id ? { ...b, status: s, paymentStatus: pay ?? b.paymentStatus, updatedAt: new Date().toISOString(), ...(s === "cancelled" ? { cancelledAt: new Date().toISOString() } : {}) } : b));

  return (
    <div>
      <PageHeader title="Bookings" subtitle={`${filtered.length} of ${list.length} bookings`} />
      <div className="sky-card mb-5 flex flex-col gap-3 rounded-[24px] p-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search user, court, or #id" className="pl-9" /></div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48"><option value="all">All statuses</option><option value="pending_payment">Pending Payment</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="expired">Expired</option></Select>
        <Select value={court} onChange={(e) => setCourt(e.target.value)} className="sm:w-48"><option value="all">All courts</option>{courts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
      </div>

      <div className="sky-card overflow-hidden rounded-[24px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="court-lines bg-primary-soft text-left text-xs font-extrabold uppercase tracking-wide text-muted"><tr><th className="px-4 py-3">#</th><th className="px-4 py-3">User</th><th className="px-4 py-3">Court</th><th className="px-4 py-3">Date / Time</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-border">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-primary-soft/50">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-muted">{b.id}</td>
                  <td className="px-4 py-3"><p className="font-extrabold text-foreground">{b.userName}</p><p className="text-xs font-medium text-muted">{b.userEmail}</p></td>
                  <td className="px-4 py-3 font-bold text-foreground">{b.courtName}</td>
                  <td className="px-4 py-3 font-medium text-muted"><p>{formatDate(b.date)}</p><p className="text-xs">{b.startTime}–{b.endTime}</p></td>
                  <td className="px-4 py-3 font-extrabold tabular-nums text-foreground">{formatIDR(b.totalPrice)}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3"><StatusBadge status={b.paymentStatus} /></td>
                  <td className="px-4 py-3"><div className="flex items-center justify-end gap-1">{b.status === "pending_payment" && <><button onClick={() => setStatusOf(b.id, "confirmed", "paid")} aria-label="Approve" title="Approve" className="cursor-pointer rounded-full p-2 text-status-confirmed hover:bg-status-confirmed-soft"><Check className="h-4 w-4" /></button><button onClick={() => setConfirm({ id: b.id, action: "reject" })} aria-label="Reject" title="Reject" className="cursor-pointer rounded-full p-2 text-status-cancelled hover:bg-status-cancelled-soft"><X className="h-4 w-4" /></button></>}{b.status === "confirmed" && <button onClick={() => setConfirm({ id: b.id, action: "cancel" })} aria-label="Cancel" title="Cancel" className="cursor-pointer rounded-full p-2 text-muted hover:bg-status-cancelled-soft hover:text-status-cancelled"><Ban className="h-4 w-4" /></button>}{["completed", "cancelled", "expired"].includes(b.status) && <span className="text-xs text-muted">—</span>}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="px-4 py-12 text-center text-sm font-medium text-muted">No bookings match your filters.</p>}
        </div>
      </div>

      <Modal open={confirm !== null} onClose={() => setConfirm(null)} title={confirm?.action === "reject" ? "Reject booking?" : "Cancel booking?"}>
        <p className="text-sm font-medium text-muted">{confirm?.action === "reject" ? `Reject booking #${confirm?.id}? It will be marked cancelled and the slot freed.` : `Cancel confirmed booking #${confirm?.id}? The user will be notified and the slot freed.`}</p>
        <div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => setConfirm(null)}>Keep</Button><Button variant="danger" onClick={() => { setStatusOf(confirm!.id, "cancelled", "failed"); setConfirm(null); }}>{confirm?.action === "reject" ? "Reject" : "Cancel booking"}</Button></div>
      </Modal>
    </div>
  );
}
