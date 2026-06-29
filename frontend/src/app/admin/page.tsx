"use client";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, CircleDollarSign, Clock4, ClipboardList, XCircle } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Stat } from "@/components/ui/misc";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { bookings, TODAY } from "@/lib/data";
import { formatDate, formatIDR } from "@/lib/format";
import { countByStatus, revenue } from "@/lib/reports";

export default function AdminDashboard() {
  const counts = countByStatus(bookings);
  const today = bookings.filter((b) => b.date === TODAY);
  const latest = [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Operational overview · Asia/Jakarta (WIB)" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Bookings today" value={`${today.length}`} icon={<ClipboardList className="h-4 w-4" />} />
        <Stat label="Pending payment" value={`${counts.pending_payment ?? 0}`} icon={<Clock4 className="h-4 w-4" />} accent="bg-amber-50 text-amber-600" />
        <Stat label="Confirmed" value={`${counts.confirmed ?? 0}`} icon={<CheckCircle2 className="h-4 w-4" />} accent="bg-emerald-50 text-emerald-600" />
        <Stat label="Revenue (paid)" value={formatIDR(revenue(bookings))} icon={<CircleDollarSign className="h-4 w-4" />} accent="bg-blue-50 text-blue-600" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-foreground/5 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-foreground/5 px-5 py-4">
            <h2 className="text-sm font-semibold text-foreground">Latest bookings</h2>
            <Link href="/admin/bookings" className="text-sm text-muted hover:text-foreground hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-foreground/5">
            {latest.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-foreground/[0.02]">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{b.userName}</p>
                  <p className="truncate text-xs text-muted">{b.courtName} · {formatDate(b.date)} · {b.startTime}–{b.endTime}</p>
                </div>
                <div className="flex items-center gap-3"><span className="hidden text-sm tabular-nums text-muted sm:block">{formatIDR(b.totalPrice)}</span><StatusBadge status={b.status} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-foreground/5">
          <h2 className="text-sm font-semibold text-foreground">Status breakdown</h2>
          <div className="mt-4 space-y-2">
            {[{ k: "confirmed", label: "Confirmed", icon: CheckCircle2, color: "text-emerald-500" }, { k: "pending_payment", label: "Pending", icon: Clock4, color: "text-amber-500" }, { k: "completed", label: "Completed", icon: CalendarCheck, color: "text-blue-500" }, { k: "cancelled", label: "Cancelled", icon: XCircle, color: "text-red-400" }, { k: "expired", label: "Expired", icon: XCircle, color: "text-foreground/30" }].map((s) => (
              <div key={s.k} className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-foreground/[0.02]"><span className="flex items-center gap-2 text-sm text-muted"><s.icon className={`h-4 w-4 ${s.color}`} /> {s.label}</span><span className="text-sm font-medium tabular-nums text-foreground">{counts[s.k] ?? 0}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
