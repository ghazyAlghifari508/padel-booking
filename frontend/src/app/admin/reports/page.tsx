"use client";
import { CalendarRange, CircleDollarSign, Volleyball } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Stat } from "@/components/ui/misc";
import { bookings } from "@/lib/data";
import { formatDate, formatIDR } from "@/lib/format";
import { byDate, countByStatus, courtUsage, revenue } from "@/lib/reports";

export default function AdminReportsPage() {
  const counts = countByStatus(bookings);
  const usage = courtUsage(bookings);
  const daily = byDate(bookings);
  const maxUsage = Math.max(...usage.map((u) => u.count), 1);
  const maxRev = Math.max(...daily.map((d) => d.revenue), 1);

  return (
    <div>
      <PageHeader title="Reports" subtitle="Revenue and usage recap. Useful bars only, no chart bloat." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Paid Revenue" value={formatIDR(revenue(bookings))} icon={<CircleDollarSign className="h-5 w-5" />} accent="bg-primary text-foreground" />
        <Stat label="Confirmed Bookings" value={`${counts.confirmed ?? 0}`} icon={<CalendarRange className="h-5 w-5" />} accent="bg-status-confirmed-soft text-status-confirmed" />
        <Stat label="Completed" value={`${counts.completed ?? 0}`} icon={<Volleyball className="h-5 w-5" />} accent="bg-muted-surface text-foreground" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="twotwo-card rounded-2xl p-5">
          <h2 className="font-normal text-foreground">Booking recap by date</h2>
          <div className="mt-4 space-y-3">
            {daily.map((d) => (
              <div key={d.date}>
                <div className="flex items-center justify-between text-sm"><span className="font-medium text-muted">{formatDate(d.date)}</span><span className="font-normal tabular-nums text-foreground">{d.count} booking · {formatIDR(d.revenue)}</span></div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted-surface"><div className="h-full rounded-full bg-primary" style={{ width: `${(d.revenue / maxRev) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="twotwo-card rounded-2xl p-5">
          <h2 className="font-normal text-foreground">Court usage</h2>
          <div className="mt-4 space-y-3">
            {usage.length === 0 ? <p className="text-sm text-muted">No usage data yet.</p> : usage.map((u) => (
              <div key={u.court}>
                <div className="flex items-center justify-between text-sm"><span className="font-medium text-muted">{u.court}</span><span className="font-normal tabular-nums text-foreground">{u.count}</span></div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted-surface"><div className="h-full rounded-full bg-primary" style={{ width: `${(u.count / maxUsage) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
