import { cn } from "@/lib/cn";
import type { BookingStatus, PaymentStatus } from "@/lib/types";

const map: Record<string, { label: string; cls: string }> = {
  pending_payment: { label: "Pending Payment", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  confirmed: { label: "Confirmed", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  completed: { label: "Completed", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-600 border-red-200" },
  expired: { label: "Expired", cls: "bg-foreground/5 text-muted border-foreground/10" },
  unpaid: { label: "Unpaid", cls: "bg-foreground/5 text-muted border-foreground/10" },
  pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  paid: { label: "Paid", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  failed: { label: "Failed", cls: "bg-red-50 text-red-600 border-red-200" },
};

export function StatusBadge({ status, className }: { status: BookingStatus | PaymentStatus; className?: string }) {
  const s = map[status] ?? { label: status, cls: "bg-foreground/5 text-muted border-foreground/10" };
  return <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap", s.cls, className)}>{s.label}</span>;
}
