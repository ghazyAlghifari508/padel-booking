import { cn } from "@/lib/cn";
import type { BookingStatus, PaymentStatus } from "@/lib/types";

// Text + color, not color-only (a11y: color-not-only).
const map: Record<string, { label: string; cls: string }> = {
  pending_payment: { label: "Pending Payment", cls: "bg-status-pending-soft text-foreground" },
  confirmed: { label: "Confirmed", cls: "bg-status-confirmed text-white" },
  completed: { label: "Completed", cls: "bg-status-completed text-white" },
  cancelled: { label: "Cancelled", cls: "bg-status-cancelled-soft text-status-cancelled" },
  expired: { label: "Expired", cls: "bg-status-expired-soft text-status-expired" },
  unpaid: { label: "Unpaid", cls: "bg-status-expired-soft text-status-expired" },
  pending: { label: "Pending", cls: "bg-status-pending-soft text-foreground" },
  paid: { label: "Paid", cls: "bg-status-paid text-white" },
  failed: { label: "Failed", cls: "bg-status-failed-soft text-status-failed" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: BookingStatus | PaymentStatus;
  className?: string;
}) {
  const s = map[status] ?? { label: status, cls: "bg-muted-surface text-muted" };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap",
        s.cls,
        className,
      )}
    >
      {s.label}
    </span>
  );
}
