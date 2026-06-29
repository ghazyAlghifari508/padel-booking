import { Calendar, Clock } from "lucide-react";
import type { Booking } from "@/lib/types";
import { formatDate, formatIDR } from "@/lib/format";
import { StatusBadge } from "./ui/StatusBadge";

export function BookingCard({ booking, action }: { booking: Booking; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-surface p-5">
      <div className="flex items-start justify-between gap-4 pb-4">
        <div><p className="text-[13px] uppercase tracking-[0.08em] text-muted">Pesanan #{booking.id}</p><h3 className="mt-2 text-[26px] font-normal leading-tight tracking-[-0.02em] text-foreground">{booking.courtName}</h3></div>
        <div className="flex flex-col items-end gap-2"><StatusBadge status={booking.status} /><StatusBadge status={booking.paymentStatus} /></div>
      </div>
      <div className="mt-4 grid gap-3 text-base text-muted sm:grid-cols-2"><span className="flex items-center gap-2"><Calendar className="h-4 w-4" />{formatDate(booking.date)}</span><span className="flex items-center gap-2"><Clock className="h-4 w-4" />{booking.startTime}–{booking.endTime}</span></div>
      <div className="mt-5 flex items-center justify-between gap-4 pt-4"><span className="text-[22px] tracking-[-0.02em] text-foreground">{formatIDR(booking.totalPrice)}</span>{action}</div>
    </div>
  );
}
