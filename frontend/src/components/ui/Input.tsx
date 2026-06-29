import { cn } from "@/lib/cn";

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-bold text-foreground">
        {label}
        {required && <span className="text-status-cancelled"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && (
        <p className="text-xs font-semibold text-status-cancelled" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[16px] border border-border bg-surface px-3.5 text-sm font-medium text-foreground",
        "placeholder:text-muted focus:border-primary-hover focus:outline-none focus:ring-4 focus:ring-accent/70",
        "transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full cursor-pointer rounded-[16px] border border-border bg-surface px-3.5 text-sm font-medium text-foreground",
        "focus:border-primary-hover focus:outline-none focus:ring-4 focus:ring-accent/70",
        className,
      )}
      {...props}
    />
  );
}
