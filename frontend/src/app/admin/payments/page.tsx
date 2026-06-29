"use client";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { bookings, payments as seed } from "@/lib/data";
import { formatDateTime, formatIDR } from "@/lib/format";
import type { Payment } from "@/lib/types";

export default function AdminPaymentsPage() {
  const [list, setList] = useState<Payment[]>(seed);
  const markPaid = (id: number) => setList((prev) => prev.map((p) => (p.id === id ? { ...p, status: "paid" } : p)));
  const bookingOf = (id: number) => bookings.find((b) => b.id === id);

  return (
    <div>
      <PageHeader title="Payments" subtitle="Verify manual payments and gateway transactions." />
      <div className="sky-card overflow-hidden rounded-[24px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="court-lines bg-primary-soft text-left text-xs font-extrabold uppercase tracking-wide text-muted"><tr><th className="px-4 py-3">Reference</th><th className="px-4 py-3">Booking</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Provider</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-border">
              {list.map((p) => {
                const b = bookingOf(p.bookingId);
                const mismatch = b && p.amount !== b.totalPrice;
                return (
                  <tr key={p.id} className="hover:bg-primary-soft/50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-foreground">{p.reference}</td>
                    <td className="px-4 py-3"><p className="font-extrabold text-foreground">#{p.bookingId}</p><p className="text-xs font-medium text-muted">{b?.userName ?? "—"}</p></td>
                    <td className="px-4 py-3 font-extrabold tabular-nums text-foreground">{formatIDR(p.amount)}{mismatch && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-status-cancelled-soft px-2 py-0.5 text-xs text-status-cancelled"><AlertTriangle className="h-3 w-3" /> mismatch</span>}</td>
                    <td className="px-4 py-3 font-medium capitalize text-muted">{p.provider}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-xs font-medium text-muted">{formatDateTime(p.createdAt)}</td>
                    <td className="px-4 py-3"><div className="flex items-center justify-end gap-2">{p.provider === "manual" && p.status !== "paid" && <Button size="sm" onClick={() => markPaid(p.id)}><CheckCircle2 className="h-4 w-4" /> Mark paid</Button>}{p.paymentUrl && <a href={p.paymentUrl} target="_blank" rel="noopener noreferrer" className="rounded-full p-2 text-muted hover:bg-primary-soft hover:text-foreground" aria-label="Open payment URL"><ExternalLink className="h-4 w-4" /></a>}{p.status === "paid" && <span className="text-xs font-extrabold text-status-confirmed">Verified</span>}</div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
