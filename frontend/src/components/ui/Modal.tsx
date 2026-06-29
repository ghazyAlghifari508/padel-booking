"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export function Modal({ open, onClose, title, children, className }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; className?: string }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-foreground/60" onClick={onClose} />
      <div className={cn("relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface", className)}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-[22px] font-normal leading-tight tracking-[-0.02em] text-foreground">{title}</h2>
          <button onClick={onClose} aria-label="Close dialog" className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-border hover:bg-primary"><X className="h-5 w-5" /></button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
