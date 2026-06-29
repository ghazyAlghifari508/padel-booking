import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Search, ShieldCheck } from "lucide-react";
import { CourtCard } from "@/components/CourtCard";
import { Logo } from "@/components/ui/misc";
import { courts } from "@/lib/data";

const nav = ["Courts", "Booking", "Schedule", "Best Slots", "Contact"];

export default function LandingPage() {
  const active = courts.filter((c) => c.status === "active");
  const heroCourt = active[0];

  return (
    <main className="bg-surface text-foreground">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => <span key={n} className="text-[13px] uppercase tracking-[0.08em]">{n}</span>)}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="grid h-10 w-10 place-items-center rounded-full border border-border" aria-label="Search"><Search className="h-5 w-5" /></Link>
          <Link href="/courts" className="rounded-full bg-primary px-6 py-3 text-[13px] uppercase tracking-[0.08em]">Book now</Link>
        </div>
      </header>

      <section className="relative h-[560px] w-full overflow-hidden bg-muted-surface">
        {heroCourt && <Image src={heroCourt.imageUrl} alt={heroCourt.name} fill priority sizes="100vw" className="object-cover grayscale" />}
        <div className="absolute inset-0 grid place-items-center px-4 text-center">
          <div>
            <p className="mb-5 text-[13px] uppercase tracking-[0.18em] text-white">Sport booking system / CourtFlow</p>
            <h1 className="mx-auto max-w-5xl text-[48px] font-normal leading-[1.05] tracking-[-0.04em] text-primary md:text-[72px]">PADel booking, stripped to the essential.</h1>
            <Link href="/courts" className="mt-8 inline-flex rounded-full bg-primary px-8 py-4 text-base text-foreground">Browse courts</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[38px] font-normal leading-[1.15] tracking-[-0.02em]">Choose a court. Pick a slot. Confirm.</h2>
          <p className="mt-6 text-base leading-relaxed text-muted">A monochrome sports-SaaS interface built around fast availability, clear prices, and zero chat back-and-forth.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {active.slice(0, 3).map((court) => <CourtCard key={court.id} court={court} />)}
        </div>
      </section>

      <section className="border-y border-border bg-muted-surface">
        <div className="mx-auto grid max-w-7xl gap-px border-x border-border bg-border md:grid-cols-3">
          {[{ icon: CalendarDays, title: "Live schedule", copy: "Slot grid built for fast court decisions." }, { icon: ShieldCheck, title: "No double book", copy: "Availability checks before confirmation." }, { icon: ArrowRight, title: "Payment ready", copy: "Manual and gateway flow in one place." }].map((item) => (
            <div key={item.title} className="bg-surface p-8">
              <item.icon className="h-6 w-6" />
              <h3 className="mt-8 text-[26px] font-normal tracking-[-0.02em]">{item.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-muted">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-2xl border border-border p-8 text-center md:p-12">
          <h2 className="text-[38px] font-normal leading-[1.15] tracking-[-0.02em]">Ready for your next rally?</h2>
          <Link href="/courts" className="mt-8 inline-flex rounded-full bg-primary px-8 py-4 text-base text-foreground">Start booking</Link>
        </div>
      </section>

      <footer className="bg-foreground px-4 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <Logo className="text-white [&_span:first-child]:border-white" />
          <p className="text-[13px] uppercase tracking-[0.08em]">Courts / Bookings / Payments</p>
          <p className="text-[13px] uppercase tracking-[0.08em]">© 2026 CourtFlow</p>
        </div>
      </footer>
    </main>
  );
}
