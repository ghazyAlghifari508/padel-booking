import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[16px] bg-primary-soft", className)} />;
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 font-extrabold tracking-tight", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_10px_22px_rgba(14,165,233,0.25)]">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 0 0 18M3 12h18" />
        </svg>
      </span>
      <span className="text-foreground">
        Court<span className="text-primary-hover">Flow</span>
      </span>
    </span>
  );
}

export function Stat({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="sky-card rounded-[24px] p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-muted">{label}</span>
        {icon && (
          <span className={cn("flex h-10 w-10 items-center justify-center rounded-full", accent ?? "bg-primary-soft text-primary-hover")}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-extrabold tabular-nums text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs font-medium text-muted">{hint}</p>}
    </div>
  );
}
