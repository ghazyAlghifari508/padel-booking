"use client";
import { Suspense, use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Clock, Copy, Loader2, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Guard } from "@/components/Guard";
import { courts } from "@/lib/data";
import { durationHours, formatIDR } from "@/lib/format";

function PaymentInner({ bookingId }: { bookingId: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const court = courts.find((c) => c.id === Number(sp.get("court")));
  const start = sp.get("start") ?? "";
  const end = sp.get("end") ?? "";
  const provider = (sp.get("provider") as "manual" | "midtrans") ?? "manual";
  const total = court ? durationHours(start, end) * court.pricePerHour : 0;
  const [state, setState] = useState<"idle" | "processing" | "done">("idle");
  const [copied, setCopied] = useState(false);

  const pay = () => {
    setState("processing");
    setTimeout(() => setState("done"), 1400);
  };

  const copy = () => {
    navigator.clipboard?.writeText("8801234567890");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (state === "done") {
    return (
      <div className="court-lines mx-auto max-w-md rounded-[28px] border border-border bg-surface p-8 text-center shadow-[0_12px_30px_rgba(14,165,233,0.1)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-status-confirmed animate-fade-up">
          <PartyPopper className="h-8 w-8 text-white" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-foreground">{provider === "midtrans" ? "Payment received!" : "Payment submitted!"}</h1>
        <p className="mt-2 text-sm font-medium text-muted">
          {provider === "midtrans" ? "Your booking is confirmed. Go play." : "Your booking waits for admin verification. You’ll be notified once confirmed."}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={() => router.push("/my-bookings")} size="lg">View my bookings</Button>
          <Button onClick={() => router.push("/courts")} variant="ghost">Book another court</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-foreground">Payment step</span>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">Payment</h1>
      <p className="mt-1 text-sm font-medium text-muted">Booking #{bookingId} · {court?.name}</p>

      <div className="mt-6 rounded-[28px] border border-border bg-surface p-5 shadow-[0_12px_30px_rgba(14,165,233,0.08)]">
        <div className="rounded-[22px] bg-accent p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground">Amount due</span>
            <span className="text-2xl font-extrabold tabular-nums text-foreground">{formatIDR(total)}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-foreground/80">
            <Clock className="h-3.5 w-3.5" /> Complete within 60 minutes or booking expires.
          </div>
        </div>

        {provider === "manual" ? (
          <div className="mt-5 rounded-[20px] border border-dashed border-primary/35 bg-primary-soft p-4">
            <p className="text-xs font-extrabold text-muted">Transfer to (BCA):</p>
            <div className="mt-1 flex items-center justify-between gap-3">
              <span className="font-mono text-lg font-extrabold text-foreground">8801234567890</span>
              <button onClick={copy} className="flex cursor-pointer items-center gap-1 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-bold hover:bg-primary-soft">
                {copied ? <><Check className="h-3.5 w-3.5 text-status-confirmed" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
              </button>
            </div>
            <p className="mt-2 text-xs font-medium text-muted">a/n CourtFlow Indonesia. Demo: click below after transfer.</p>
          </div>
        ) : (
          <div className="mt-5 rounded-[20px] border border-dashed border-primary/35 bg-primary-soft p-4 text-center">
            <p className="text-sm font-medium text-muted">You’ll be redirected to Midtrans Snap sandbox.</p>
          </div>
        )}

        <Button onClick={pay} disabled={state === "processing"} size="lg" className="mt-5 w-full">
          {state === "processing" ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</> : provider === "midtrans" ? "Pay with Midtrans" : "I've paid — submit"}
        </Button>
      </div>
    </div>
  );
}

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <Guard><Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-primary-hover" /></div>}><PaymentInner bookingId={id} /></Suspense></Guard>;
}
