import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "court-lines flex flex-col items-center justify-center rounded-[24px] border border-dashed border-primary/35 bg-surface px-6 py-14 text-center shadow-[0_12px_30px_rgba(14,165,233,0.08)]",
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-foreground">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="text-base font-extrabold text-foreground">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
