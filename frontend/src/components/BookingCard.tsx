import { Calendar, Clock } from "lucide-react";
import type { Booking } from "@/lib/types";
import { formatIDR, formatDate } from "@/lib/format";
import { StatusBadge } from "./ui/StatusBadge";

export function BookingCard({
  booking,
  action,
}: {
  booking: Booking;
  action?: React.ReactNode;
}) {
  return (
    <div className="sky-card relative overflow-hidden rounded-[24px] p-4">
      <div className="absolute inset-y-0 left-0 w-2 bg-accent" />
      <div className="pl-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-primary-hover">Reservation ticket</p>
            <h3 className="mt-1 font-extrabold text-foreground">{booking.courtName}</h3>
            <p className="mt-0.5 text-xs font-medium text-muted">#{booking.id}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={booking.status} />
            <StatusBadge status={booking.paymentStatus} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary-hover" /> {formatDate(booking.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary-hover" /> {booking.startTime}–{booking.endTime}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
          <span className="text-base font-extrabold tabular-nums text-foreground">
            {formatIDR(booking.totalPrice)}
          </span>
          {action}
        </div>
      </div>
    </div>
  );
}
