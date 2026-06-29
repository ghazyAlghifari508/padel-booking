import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "highlight" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "bg-foreground text-white hover:bg-foreground/90",
  highlight: "bg-primary text-foreground hover:bg-primary-hover",
  ghost: "text-foreground hover:bg-muted-surface",
  danger: "bg-foreground text-white hover:bg-foreground/90",
  outline: "border border-border bg-surface text-foreground hover:bg-muted-surface",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-4 text-[13px] gap-1.5",
  md: "min-h-11 px-6 text-sm gap-2",
  lg: "min-h-12 px-8 text-base gap-2",
};

export function Button({ variant = "primary", size = "md", className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-normal uppercase tracking-[0.04em] transition-colors duration-200",
        "cursor-pointer disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
