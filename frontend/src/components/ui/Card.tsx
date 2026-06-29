import { cn } from "@/lib/cn";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-[24px] border border-border bg-surface shadow-[0_12px_30px_rgba(14,165,233,0.08)]", className)}
      {...props}
    />
  );
}
