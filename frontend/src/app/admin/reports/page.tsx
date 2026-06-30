"use client";
import { CircleDollarSign, Volleyball } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Stat } from "@/components/ui/misc";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { formatIDR } from "@/lib/format";

export default function AdminReportsPage() {
  const { data, loading, error } = useApi(() => api.admin.reports(), []);
  if (loading) return <p className="py-20 text-center text-sm text-muted">Loading reports…</p>;
  if (error) return <p className="py-20 text-center text-sm text-red-600">{error}</p>;
  const usage = data?.courts ?? [];
  const maxUsage = Math.max(...usage.map((u) => u.bookings), 1);

  return (
    <div>
      <PageHeader title="Reports" subtitle="Revenue and usage recap from database." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Stat label="Paid Revenue" value={formatIDR(data?.totalRevenue ?? 0)} icon={<CircleDollarSign className="h-5 w-5" />} accent="bg-primary text-foreground" />
        <Stat label="Tracked Courts" value={`${usage.length}`} icon={<Volleyball className="h-5 w-5" />} accent="bg-muted-surface text-foreground" />
      </div>

      <div className="mt-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-foreground/5">
        <h2 className="text-sm font-semibold text-foreground">Court usage</h2>
        <div className="mt-4 space-y-3">
          {usage.length === 0 ? <p className="text-sm text-muted">No usage data yet.</p> : usage.map((u) => (
            <div key={u.courtId}>
              <div className="flex items-center justify-between text-sm"><span className="font-medium text-muted">{u.courtName}</span><span className="font-medium tabular-nums text-foreground">{u.bookings} booking · {formatIDR(u.revenue)}</span></div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-foreground/5"><div className="h-full rounded-full bg-foreground" style={{ width: `${(u.bookings / maxUsage) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
