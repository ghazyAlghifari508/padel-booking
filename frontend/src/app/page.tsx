import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Clock, MapPin, ShieldCheck, Smartphone } from "lucide-react";
import { CourtCardVertical } from "@/components/CourtCardVertical";
import { Logo } from "@/components/ui/misc";
import { Reveal } from "@/components/ui/Reveal";
import { api } from "@/lib/api";

const nav = ["Lapangan", "Pemesanan", "Jadwal", "Best Slots", "Kontak"];

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const active = await api.courts();
  const heroCourt = active[0];

  return (
    <main className="bg-background text-foreground">
      {/* Nav */}
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => <span key={n} className="text-[13px] uppercase tracking-[0.08em]">{n}</span>)}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="grid h-10 w-10 place-items-center" aria-label="Cari"><Smartphone className="h-5 w-5" /></Link>
          <Link href="/courts" className="rounded-full bg-primary px-6 py-3 text-[13px] uppercase tracking-[0.08em]">Pesan Sekarang</Link>
        </div>
      </header>

      {/* Hero — entrance animations */}
      <section className="relative h-[560px] w-full overflow-hidden bg-foreground">
        {heroCourt && <Image src={heroCourt.imageUrl} alt={heroCourt.name} fill priority sizes="100vw" className="hero-animate-image object-cover grayscale opacity-60" />}
        <div className="absolute inset-0 grid place-items-center px-4 text-center">
          <div>
            <p className="hero-animate-subtitle mb-5 text-[13px] uppercase tracking-[0.18em] text-white/80">Sport booking system / CourtFlow</p>
            <h1 className="hero-animate-title mx-auto max-w-5xl text-[48px] font-normal leading-[1.05] tracking-[-0.04em] text-primary md:text-[72px]">Padel booking, stripped to the essential.</h1>
            <Link href="/courts" className="hero-animate-cta mt-8 inline-flex rounded-full bg-primary px-8 py-4 text-base text-foreground">Lihat Lapangan</Link>
          </div>
        </div>
      </section>

      {/* Featured courts */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal animation="fade-up">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[38px] font-normal leading-[1.15] tracking-[-0.02em]">Pilih lapangan. Pilih slot. Konfirmasi.</h2>
            <p className="mt-6 text-base leading-relaxed text-muted">Antarmuka sports-SaaS monokrom yang dibangun untuk ketersediaan cepat, harga jelas, tanpa bolak-balik chat.</p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {active.slice(0, 6).map((court, i) => (
            <Reveal key={court.id} animation="fade-up" delay={i * 150}>
              <CourtCardVertical court={court} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-foreground text-white">
        <div className="mx-auto grid max-w-7xl md:grid-cols-3">
          {[{ icon: CalendarDays, title: "Jadwal Langsung", copy: "Grid slot real-time untuk keputusan cepat." }, { icon: ShieldCheck, title: "Tanpa Dobel Booking", copy: "Pengecekan ketersediaan sebelum konfirmasi." }, { icon: ArrowRight, title: "Siap Bayar", copy: "Alur manual dan gateway dalam satu tempat." }].map((item, i) => (
            <Reveal key={item.title} animation="fade-up" delay={i * 120}>
              <div className="p-8 md:border-r md:border-white/15 last:border-r-0">
                <item.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-8 text-[26px] font-normal tracking-[-0.02em] text-white">{item.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-white/60">{item.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>


      {/* Testimoni — industrial pull-quotes */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal animation="fade-up">
          <div className="mb-12">
            <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-[11px] uppercase tracking-[0.12em]">Testimoni</span>
            <h2 className="mt-6 max-w-xl text-[38px] font-normal leading-[1.15] tracking-[-0.02em]">Yang pemain katakan tentang CourtFlow.</h2>
          </div>
        </Reveal>
        <div className="grid gap-0 md:grid-cols-3 border-t">
          {[{ name: "Andi Pratama", role: "Pengguna Aktif", text: "\"Gampang banget booking lapangan. Slot jelas, harga transparan. Nggak perlu ribet.\"" },
            { name: "Bunga Lestari", role: "Komunitas Padel", text: "\"Aplikasi keren buat komunitas padel. Admin fast response, pembayaran aman.\"" },
            { name: "Citra Dewi", role: "Pemain Reguler", text: "\"Desainnya simple dan premium. Suka banget sama fitur jadwal real-time.\"" }].map((t, i) => (
            <Reveal key={t.name} animation="fade-up" delay={i * 150}>
              <div className={`p-10 ${i < 2 ? "border-b md:border-b-0 md:border-r" : ""}`}>
                <p className="text-base leading-relaxed text-foreground">{t.text}</p>
                <div className="mt-8 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-foreground grid place-items-center text-white text-[13px] uppercase">{t.name[0]}</div>
                  <div><p className="text-[13px] uppercase tracking-[0.08em]">{t.name}</p><p className="text-[11px] uppercase tracking-[0.08em] text-muted">{t.role}</p></div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <Reveal animation="scale-in">
          <div className="rounded-2xl bg-foreground p-8 text-center md:p-12">
            <h2 className="text-[38px] font-normal leading-[1.15] tracking-[-0.02em] text-white">Siap untuk rally berikutnya?</h2>
            <Link href="/courts" className="mt-8 inline-flex rounded-full bg-primary px-8 py-4 text-base text-foreground">Mulai Booking</Link>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="bg-foreground px-4 pt-16 pb-8 text-white">
        <div className="mx-auto max-w-7xl">
          {/* Top grid */}
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Logo className="text-white [&_span:first-child]:border-white" />
              <p className="mt-6 text-sm leading-relaxed text-white/50">Sistem booking lapangan padel premium. Pilih lapangan, tandai slot, konfirmasi — dalam hitungan detik.</p>
            </div>

            {/* Navigasi */}
            <div>
              <h4 className="text-[13px] uppercase tracking-[0.12em] text-white/40">Navigasi</h4>
              <ul className="mt-5 space-y-3">
                {[{ label: "Lapangan", href: "/courts" }, { label: "Cara Booking", href: "#" }, { label: "Harga & Slot", href: "#" }, { label: "FAQ", href: "#" }].map((link) => (
                  <li key={link.label}><Link href={link.href} className="text-sm text-white/70 transition-colors hover:text-primary">{link.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Kontak */}
            <div>
              <h4 className="text-[13px] uppercase tracking-[0.12em] text-white/40">Kontak</h4>
              <ul className="mt-5 space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Jl. Padel Raya No.12, Jakarta</li>
                <li className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-primary" />+62 812-XXXX-XXXX</li>
                <li className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary" />hello@courtflow.id</li>
              </ul>
            </div>

            {/* Jam Operasional */}
            <div>
              <h4 className="text-[13px] uppercase tracking-[0.12em] text-white/40">Jam Operasional</h4>
              <ul className="mt-5 space-y-3 text-sm text-white/70">
                <li className="flex justify-between"><span>Senin — Jumat</span><span className="text-white">06:00 — 23:00</span></li>
                <li className="flex justify-between"><span>Sabtu — Minggu</span><span className="text-white">07:00 — 22:00</span></li>
                <li className="flex justify-between"><span>Hari Libur</span><span className="text-white">08:00 — 21:00</span></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="my-10 h-px bg-white/10" />

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-[13px] text-white/40">© 2026 CourtFlow. All rights reserved.</p>
            <div className="flex items-center gap-6">
              {["Instagram", "Twitter", "Telegram"].map((social) => (
                <span key={social} className="text-[13px] uppercase tracking-[0.08em] text-white/40 transition-colors hover:text-primary cursor-pointer">{social}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
