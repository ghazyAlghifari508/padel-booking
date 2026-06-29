import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "highlight" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover shadow-[0_12px_24px_rgba(14,165,233,0.24)]",
  secondary: "bg-foreground text-white hover:bg-foreground/90",
  highlight: "bg-accent text-foreground hover:bg-status-pending-soft",
  ghost: "text-foreground hover:bg-primary-soft",
  danger: "bg-status-cancelled text-white hover:bg-status-cancelled/90",
  outline: "border border-border bg-surface text-foreground hover:bg-primary-soft",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-3.5 text-sm gap-1.5",
  md: "min-h-11 px-5 text-sm gap-2",
  lg: "min-h-12 px-7 text-base gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold transition-all duration-200",
        "cursor-pointer disabled:pointer-events-none disabled:opacity-50",
        "hover:-translate-y-0.5 active:translate-y-0",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
