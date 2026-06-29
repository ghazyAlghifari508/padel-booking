"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Animation = "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-in";

interface RevealProps {
  children: ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function Reveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 700,
  className,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("reveal-visible");
          if (once) observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, once]);

  return (
    <div
      ref={ref}
      className={cn("reveal-hidden", `reveal-${animation}`, className)}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}

/** Stagger wrapper — adds incremental delay to each Reveal child */
export function Stagger({
  children,
  interval = 120,
  className,
}: {
  children: ReactNode;
  interval?: number;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
