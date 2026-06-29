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
      <PageHeader title="Dashboard" subtitle="Bright operational overview · Asia/Jakarta (WIB)" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Bookings Today" value={`${today.length}`} icon={<ClipboardList className="h-5 w-5" />} />
        <Stat label="Pending Payment" value={`${counts.pending_payment ?? 0}`} icon={<Clock4 className="h-5 w-5" />} accent="bg-status-pending-soft text-foreground" />
        <Stat label="Confirmed" value={`${counts.confirmed ?? 0}`} icon={<CheckCircle2 className="h-5 w-5" />} accent="bg-status-confirmed-soft text-status-confirmed" />
        <Stat label="Revenue (paid)" value={formatIDR(revenue(bookings))} icon={<CircleDollarSign className="h-5 w-5" />} accent="bg-accent text-foreground" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="sky-card overflow-hidden rounded-[24px] lg:col-span-2">
          <div className="court-lines flex items-center justify-between border-b border-border bg-primary-soft px-5 py-4">
            <h2 className="font-extrabold text-foreground">Latest bookings</h2>
            <Link href="/admin/bookings" className="text-sm font-extrabold text-primary-hover hover:underline">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {latest.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-primary-soft/50">
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold text-foreground">{b.userName}</p>
                  <p className="truncate text-xs font-medium text-muted">{b.courtName} · {formatDate(b.date)} · {b.startTime}–{b.endTime}</p>
                </div>
                <div className="flex items-center gap-2"><span className="hidden text-sm font-extrabold tabular-nums text-foreground sm:block">{formatIDR(b.totalPrice)}</span><StatusBadge status={b.status} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="sky-card rounded-[24px] p-5">
          <h2 className="font-extrabold text-foreground">Status breakdown</h2>
          <div className="mt-4 space-y-3">
            {[{ k: "confirmed", label: "Confirmed", icon: CheckCircle2, color: "text-status-confirmed" }, { k: "pending_payment", label: "Pending", icon: Clock4, color: "text-status-pending" }, { k: "completed", label: "Completed", icon: CalendarCheck, color: "text-status-completed" }, { k: "cancelled", label: "Cancelled", icon: XCircle, color: "text-status-cancelled" }, { k: "expired", label: "Expired", icon: XCircle, color: "text-status-expired" }].map((s) => (
              <div key={s.k} className="flex items-center justify-between rounded-full bg-primary-soft px-3 py-2"><span className="flex items-center gap-2 text-sm font-bold text-muted"><s.icon className={`h-4 w-4 ${s.color}`} /> {s.label}</span><span className="text-sm font-extrabold tabular-nums text-foreground">{counts[s.k] ?? 0}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
