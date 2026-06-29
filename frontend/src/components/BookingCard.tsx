import { Calendar, Clock, ChevronRight } from "lucide-react";
import type { Booking } from "@/lib/types";
import { formatDate, formatIDR } from "@/lib/format";
import { StatusBadge } from "./ui/StatusBadge";

export function BookingCard({ booking, action }: { booking: Booking; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-black/10 bg-surface sm:flex-row">
      {/* Color strip */}
      <div
        className={`w-full shrink-0 sm:w-1 ${
          ["pending_payment", "confirmed"].includes(booking.status)
            ? "bg-primary"
            : "bg-muted-surface"
        }`}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-6">
        {/* Court + ID */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
              #{booking.id}
            </p>
            <StatusBadge status={booking.status} />
            <StatusBadge status={booking.paymentStatus} />
          </div>
          <h3 className="mt-1 truncate text-base font-bold text-foreground">{booking.courtName}</h3>
        </div>

        {/* Date & time */}
        <div className="flex shrink-0 flex-col gap-1 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(booking.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {booking.startTime}–{booking.endTime}
          </span>
        </div>

        {/* Price */}
        <div className="shrink-0 text-right">
          <p className="text-[11px] text-muted">Total</p>
          <p className="text-base font-bold text-foreground">{formatIDR(booking.totalPrice)}</p>
        </div>

        {/* Action or chevron */}
        <div className="shrink-0">
          {action ?? <ChevronRight className="h-4 w-4 text-muted" />}
        </div>
      </div>
    </div>
  );
}
