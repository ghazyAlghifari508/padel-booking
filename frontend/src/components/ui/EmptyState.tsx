import { cn } from "@/lib/cn";
import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description, action, className }: { icon: LucideIcon; title: string; description?: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-border bg-surface px-6 py-16 text-center", className)}>
      <div className="mb-5 grid h-14 w-14 place-items-center rounded-full border border-border bg-primary"><Icon className="h-6 w-6" aria-hidden /></div>
      <h3 className="text-[26px] font-normal leading-tight tracking-[-0.02em] text-foreground">{title}</h3>
      {description && <p className="mt-3 max-w-md text-base leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
