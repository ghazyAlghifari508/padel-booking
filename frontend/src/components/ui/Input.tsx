import { cn } from "@/lib/cn";

export function Field({ label, htmlFor, required, error, hint, children }: { label: string; htmlFor: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-[13px] font-normal uppercase tracking-[0.08em] text-foreground">
        {label}{required && <span> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[13px] leading-relaxed text-muted">{hint}</p>}
      {error && <p className="text-[13px] text-foreground underline" role="alert">{error}</p>}
    </div>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-12 w-full rounded-full border border-border bg-surface px-5 text-base font-normal text-foreground placeholder:text-muted focus:border-2 focus:outline-none", className)} {...props} />;
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("h-12 w-full cursor-pointer rounded-full border border-border bg-surface px-5 text-base font-normal text-foreground focus:border-2 focus:outline-none", className)} {...props} />;
}
