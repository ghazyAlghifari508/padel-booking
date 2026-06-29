import Link from "next/link";
import { ArrowRight, CalendarCheck, Clock, MapPin, ShieldCheck, Zap } from "lucide-react";
import { Logo, Stat } from "@/components/ui/misc";
import { Button } from "@/components/ui/Button";
import { CourtCard } from "@/components/CourtCard";
import { courts } from "@/lib/data";
import { formatIDR } from "@/lib/format";

const previewSlots = ["08:00", "09:00", "10:00", "17:00", "18:00", "20:00"];

export default function LandingPage() {
  const active = courts.filter((c) => c.status === "active");
  const featured = active.slice(0, 3);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-4">
          <Logo className="text-lg" />
          <div className="flex items-center gap-2">
            <Link href="/courts" className="hidden rounded-full px-4 py-2 text-sm font-bold text-muted hover:bg-primary-soft hover:text-foreground sm:block">
              Browse Courts
            </Link>
            <Link href="/login"><Button size="sm" variant="ghost">Login</Button></Link>
            <Link href="/register"><Button size="sm">Sign Up</Button></Link>
          </div>
        </div>
      </header>

      <section className="court-lines relative overflow-hidden">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-4 py-16 md:grid-cols-[1fr_460px] md:items-center md:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-surface px-3 py-1 text-xs font-extrabold text-primary-hover">
              <Zap className="h-3.5 w-3.5" /> Book in under 60 seconds
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-5xl">
              Book padel courts in seconds. <span className="text-primary-hover">Pick a slot, play.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              Bright, fast court booking for your local padel club. See available slots, lock your court, and get moving.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/courts"><Button size="lg">Find a Court <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="/register"><Button size="lg" variant="highlight">Create Account</Button></Link>
            </div>
          </div>

          <div className="sky-card rounded-[28px] p-5 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-primary-hover">Quick booking</p>
                <h2 className="mt-1 text-xl font-extrabold text-foreground">Grab next slot</h2>
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-foreground">Live preview</span>
            </div>
            <div className="mt-4 rounded-[22px] border border-border bg-primary-soft p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-extrabold text-foreground">{active[0]?.name}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-muted"><MapPin className="h-3.5 w-3.5" /> {active[0]?.location}</p>
                </div>
                <p className="rounded-full bg-surface px-3 py-1 text-xs font-extrabold text-primary-hover">{formatIDR(active[0]?.pricePerHour ?? 0)}/hr</p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {previewSlots.map((s, i) => (
                  <span key={s} className={i === 4 ? "slot-selected rounded-[14px] px-3 py-3 text-center text-sm font-extrabold" : "slot-available rounded-[14px] px-3 py-3 text-center text-sm font-extrabold text-foreground"}>
                    {s}
                  </span>
                ))}
              </div>
              <Button className="mt-4 w-full">Book 18:00 slot</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Active Courts" value={`${active.length}`} hint="Ready to book" icon={<MapPin className="h-5 w-5" />} />
          <Stat label="Avg. Confirm" value="2 min" hint="After payment" icon={<CalendarCheck className="h-5 w-5" />} accent="bg-accent text-foreground" />
          <Stat label="Secure Pay" value="Midtrans" hint="Sandbox + manual" icon={<ShieldCheck className="h-5 w-5" />} accent="bg-status-confirmed-soft text-status-confirmed" />
          <Stat label="Peak Slots" value="6–9 PM" hint="Book early" icon={<Clock className="h-5 w-5" />} accent="bg-status-pending-soft text-foreground" />
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-14">
        <h2 className="text-center text-2xl font-extrabold text-foreground">Book without admin chat loops</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {[
            { n: "1", t: "Pick court", d: "Browse active courts and spot next slots fast." },
            { n: "2", t: "Choose time", d: "Available slots show with highlighter cue, booked slots stay clear." },
            { n: "3", t: "Confirm & play", d: "Pay, get confirmed, show up ready." },
          ].map((s) => (
            <div key={s.n} className="sky-card rounded-[24px] p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-on-primary">{s.n}</span>
              <h3 className="mt-4 font-extrabold text-foreground">{s.t}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 pb-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-foreground">Today&apos;s courts</span>
            <h2 className="mt-3 text-2xl font-extrabold text-foreground">Featured courts</h2>
          </div>
          <Link href="/courts" className="text-sm font-extrabold text-primary-hover hover:underline">View all →</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => <CourtCard key={c.id} court={c} />)}
        </div>
      </section>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-3 px-4 py-8 text-sm font-medium text-muted sm:flex-row">
          <Logo />
          <p>© 2026 CourtFlow. Frontend demo — dummy data, no backend.</p>
        </div>
      </footer>
    </div>
  );
}
