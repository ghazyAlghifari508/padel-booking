"use client";

import Link from "next/link";
import { Suspense, use, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Copy, Loader2 } from "lucide-react";
import { Guard } from "@/components/Guard";
import { Button } from "@/components/ui/Button";
import { courts } from "@/lib/data";
import { durationHours, formatDate, formatIDR } from "@/lib/format";

type PayState = "idle" | "processing" | "done";

function PaymentInner({ bookingId }: { bookingId: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const court = courts.find((c) => c.id === Number(sp.get("court")));
  const date = sp.get("date") ?? "";
  const start = sp.get("start") ?? "";
  const end = sp.get("end") ?? "";
  const provider = sp.get("provider") === "midtrans" ? "midtrans" : "manual";
  const total = court && start && end ? durationHours(start, end) * court.pricePerHour : 0;
  const [state, setState] = useState<PayState>("idle");
  const [copied, setCopied] = useState(false);

  const pay = () => {
    setState("processing");
    setTimeout(() => setState("done"), 900);
  };

  const copy = async () => {
    await navigator.clipboard?.writeText("8801234567890");
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  if (!court || !date || !start || !end) {
    return <div className="mx-auto max-w-lg rounded-2xl border border-border p-8 text-center"><p className="text-[13px] uppercase tracking-[0.12em] text-muted">Payment unavailable</p><h1 className="mt-3 text-[38px] leading-tight tracking-[-0.03em]">Booking data missing.</h1><Link href="/courts" className="mt-6 inline-block rounded-full bg-primary px-6 py-3 text-[13px] uppercase tracking-[0.08em]">Start again</Link></div>;
  }

  if (state === "done") {
    return (
      <section className="mx-auto max-w-3xl rounded-2xl border border-border p-8 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-border bg-primary"><Check className="h-9 w-9" /></div>
        <p className="mt-8 text-[13px] uppercase tracking-[0.16em] text-muted">Booking #{bookingId}</p>
        <h1 className="mt-3 text-[56px] font-normal leading-[1.05] tracking-[-0.04em]">{provider === "midtrans" ? "Paid. Court locked." : "Receipt queued for admin."}</h1>
        <p className="mx-auto mt-5 max-w-md text-base text-muted">{provider === "midtrans" ? "Your reservation is confirmed." : "Manual transfer stays pending until staff verification."}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button onClick={() => router.push("/my-bookings")}>View bookings</Button><Button variant="outline" onClick={() => router.push("/courts")}>Book another</Button></div>
      </section>
    );
  }

  return (
    <div>
      <section className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="border-y border-border py-8">
          <p className="text-[13px] uppercase tracking-[0.16em] text-muted">Payment console</p>
          <h1 className="mt-4 max-w-3xl text-[56px] font-normal leading-[1.05] tracking-[-0.04em] md:text-[72px]">One receipt. One slot. Sixty minutes.</h1>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            <Tile label="Booking" value={`#${bookingId}`} />
            <Tile label="Court" value={court.name} />
            <Tile label="Schedule" value={`${formatDate(date)} · ${start}–${end}`} />
          </div>
        </div>

        <aside className="rounded-2xl border border-border p-5 lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-2xl border border-border bg-primary p-5">
            <p className="text-[13px] uppercase tracking-[0.12em]">Amount due</p>
            <p className="mt-3 text-[38px] leading-none tracking-[-0.04em]">{formatIDR(total)}</p>
            <p className="mt-3 text-sm">Expires in 60 minutes.</p>
          </div>

          {provider === "manual" ? (
            <div className="mt-5 rounded-2xl border border-border p-5">
              <p className="text-[13px] uppercase tracking-[0.12em] text-muted">BCA transfer</p>
              <div className="mt-4 flex items-center justify-between gap-3 border-y border-border py-4">
                <span className="font-mono text-xl tracking-[-0.02em]">8801234567890</span>
                <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-[13px] uppercase tracking-[0.08em] hover:bg-muted-surface">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Copied" : "Copy"}</button>
              </div>
              <p className="mt-3 text-sm text-muted">a/n CourtFlow Indonesia. Demo flow: submit after transfer.</p>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-border p-5"><p className="text-[13px] uppercase tracking-[0.12em] text-muted">Gateway</p><p className="mt-3 text-base">Midtrans sandbox redirect simulated in-app.</p></div>
          )}

          <Button onClick={pay} disabled={state === "processing"} size="lg" className="mt-5 w-full">
            {state === "processing" ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing</> : provider === "midtrans" ? "Pay with gateway" : "Submit receipt"}
          </Button>
        </aside>
      </section>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-border p-5"><p className="text-[13px] uppercase tracking-[0.12em] text-muted">{label}</p><p className="mt-3 text-[22px] leading-tight tracking-[-0.03em]">{value}</p></div>;
}

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <Guard><Suspense fallback={<div className="grid py-20 place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}><PaymentInner bookingId={id} /></Suspense></Guard>;
}
