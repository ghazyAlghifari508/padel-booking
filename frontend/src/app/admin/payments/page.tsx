"use client";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { formatDateTime, formatIDR } from "@/lib/format";

export default function AdminPaymentsPage() {
  const { data: list, loading, error, reload } = useApi(() => api.admin.payments(), []);
  const markPaid = async (bookingId: number) => {
    await api.admin.markPaid(bookingId);
    reload();
  };

  if (loading) return <p className="py-20 text-center text-sm text-muted">Loading payments…</p>;
  if (error) return <p className="py-20 text-center text-sm text-red-600">{error}</p>;

  return (
    <div>
      <PageHeader title="Payments" subtitle="Verify manual payments and gateway transactions." />
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-foreground/5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-foreground/5 text-left text-xs font-semibold text-muted"><tr><th className="px-4 py-3">Reference</th><th className="px-4 py-3">Booking</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Provider</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Proof</th><th className="px-4 py-3">Created</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-foreground/5">
              {(list ?? []).map((p) => (
                <tr key={p.id} className="hover:bg-foreground/[0.02]">
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{p.reference}</td>
                  <td className="px-4 py-3 font-medium text-foreground">#{p.bookingId}</td>
                  <td className="px-4 py-3 font-medium tabular-nums text-foreground">{formatIDR(p.amount)}</td>
                  <td className="px-4 py-3 capitalize text-muted">{p.provider}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-xs">{p.proofUrl ? <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:8080"}${p.proofUrl}`} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline">View proof</a> : <span className="text-muted">—</span>}</td>
                  <td className="px-4 py-3 text-xs text-muted">{formatDateTime(p.createdAt)}</td>
                  <td className="px-4 py-3"><div className="flex items-center justify-end gap-2">{p.provider === "manual" && p.status !== "paid" && <Button size="sm" variant="secondary" className="rounded-lg tracking-normal uppercase-none" onClick={() => markPaid(p.bookingId)}><CheckCircle2 className="h-4 w-4" /> Mark paid</Button>}{p.paymentUrl && <a href={p.paymentUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2 text-muted hover:bg-foreground/5 hover:text-foreground" aria-label="Open payment URL"><ExternalLink className="h-4 w-4" /></a>}{p.status === "paid" && <span className="text-xs font-medium text-emerald-600">Verified</span>}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
