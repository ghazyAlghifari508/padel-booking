import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-muted-surface", className)} />;
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-3 font-normal uppercase tracking-[0.12em]", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-full border border-border bg-primary text-foreground">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3a9 9 0 0 0 0 18M3 12h18" />
        </svg>
      </span>
      <span>CourtFlow</span>
    </span>
  );
}

export function Stat({ label, value, hint, icon, accent }: { label: string; value: string; hint?: string; icon?: React.ReactNode; accent?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
        <span className="text-[13px] uppercase tracking-[0.08em] text-muted">{label}</span>
        {icon && <span className={cn("grid h-10 w-10 place-items-center rounded-full border border-border", accent ?? "bg-primary text-foreground")}>{icon}</span>}
      </div>
      <p className="mt-4 text-[32px] font-normal leading-none tracking-[-0.02em] text-foreground">{value}</p>
      {hint && <p className="mt-2 text-[13px] leading-relaxed text-muted">{hint}</p>}
    </div>
  );
}
