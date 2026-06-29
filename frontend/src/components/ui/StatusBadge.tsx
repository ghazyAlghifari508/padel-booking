import { cn } from "@/lib/cn";
import type { BookingStatus, PaymentStatus } from "@/lib/types";

const map: Record<string, { label: string; cls: string }> = {
  pending_payment: { label: "Pending Payment", cls: "bg-primary text-foreground" },
  confirmed: { label: "Confirmed", cls: "bg-primary text-foreground" },
  completed: { label: "Completed", cls: "bg-foreground text-white" },
  cancelled: { label: "Cancelled", cls: "bg-muted-surface text-foreground" },
  expired: { label: "Expired", cls: "bg-muted-surface text-muted" },
  unpaid: { label: "Unpaid", cls: "bg-muted-surface text-muted" },
  pending: { label: "Pending", cls: "bg-primary text-foreground" },
  paid: { label: "Paid", cls: "bg-primary text-foreground" },
  failed: { label: "Failed", cls: "bg-muted-surface text-foreground" },
};

export function StatusBadge({ status, className }: { status: BookingStatus | PaymentStatus; className?: string }) {
  const s = map[status] ?? { label: status, cls: "bg-muted-surface text-muted" };
  return <span className={cn("inline-flex items-center rounded-full border border-border px-3 py-1 text-[13px] font-normal uppercase tracking-[0.06em] whitespace-nowrap", s.cls, className)}>{s.label}</span>;
}
