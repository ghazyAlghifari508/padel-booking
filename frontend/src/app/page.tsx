import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin, ShieldCheck, Smartphone, Wifi } from "lucide-react";
import { CourtCard } from "@/components/CourtCard";
import { Logo } from "@/components/ui/misc";
import { courts } from "@/lib/data";

const nav = ["Lapangan", "Pemesanan", "Jadwal", "Best Slots", "Kontak"];

export default function LandingPage() {
  const active = courts.filter((c) => c.status === "active");
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

      {/* Hero */}
      <section className="relative h-[560px] w-full overflow-hidden bg-foreground">
        {heroCourt && <Image src={heroCourt.imageUrl} alt={heroCourt.name} fill priority sizes="100vw" className="object-cover grayscale opacity-60" />}
        <div className="absolute inset-0 grid place-items-center px-4 text-center">
          <div>
            <p className="mb-5 text-[13px] uppercase tracking-[0.18em] text-white/80">Sport booking system / CourtFlow</p>
            <h1 className="mx-auto max-w-5xl text-[48px] font-normal leading-[1.05] tracking-[-0.04em] text-primary md:text-[72px]">Padel booking, stripped to the essential.</h1>
            <Link href="/courts" className="mt-8 inline-flex rounded-full bg-primary px-8 py-4 text-base text-foreground">Lihat Lapangan</Link>
          </div>
        </div>
      </section>

      {/* Featured courts */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[38px] font-normal leading-[1.15] tracking-[-0.02em]">Pilih lapangan. Pilih slot. Konfirmasi.</h2>
          <p className="mt-6 text-base leading-relaxed text-muted">Antarmuka sports-SaaS monokrom yang dibangun untuk ketersediaan cepat, harga jelas, tanpa bolak-balik chat.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {active.slice(0, 3).map((court) => <CourtCard key={court.id} court={court} />)}
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-muted-surface">
        <div className="mx-auto grid max-w-7xl md:grid-cols-3">
          {[{ icon: CalendarDays, title: "Jadwal Langsung", copy: "Grid slot real-time untuk keputusan cepat." }, { icon: ShieldCheck, title: "Tanpa Dobel Booking", copy: "Pengecekan ketersediaan sebelum konfirmasi." }, { icon: ArrowRight, title: "Siap Bayar", copy: "Alur manual dan gateway dalam satu tempat." }].map((item) => (
            <div key={item.title} className="bg-surface p-8 md:border-r last:border-r-0">
              <item.icon className="h-6 w-6" />
              <h3 className="mt-8 text-[26px] font-normal tracking-[-0.02em]">{item.title}</h3>
              <p className="mt-4 text-base leading-relaxed text-muted">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEW SECTION: Cara Booking */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[38px] font-normal leading-[1.15] tracking-[-0.02em]">Cara Booking</h2>
          <p className="mt-6 text-base leading-relaxed text-muted">Tiga langkah mudah untuk memulai permainan Anda.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[{ step: "01", title: "Pilih Lapangan", icon: MapPin, desc: "Jelajahi lapangan terbaik dengan foto, lokasi, dan harga per jam." },
            { step: "02", title: "Pilih Slot", icon: Clock, desc: "Lihat ketersediaan waktu secara real-time dan pilih sesi yang cocok." },
            { step: "03", title: "Konfirmasi & Bayar", icon: ShieldCheck, desc: "Konfirmasi booking dan bayar via transfer atau gateway." }].map((s) => (
            <div key={s.step} className="rounded-2xl bg-surface p-8">
              <span className="text-[56px] font-normal leading-none tracking-[-0.04em] text-primary">{s.step}</span>
              <s.icon className="mt-6 h-6 w-6" />
              <h3 className="mt-4 text-[26px] font-normal tracking-[-0.02em]">{s.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEW SECTION: Fasilitas */}
      <section className="bg-muted-surface">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[38px] font-normal leading-[1.15] tracking-[-0.02em]">Fasilitas Kami</h2>
            <p className="mt-6 text-base leading-relaxed text-muted">Lapangan standar turnamen dengan fasilitas lengkap.</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[{ icon: MapPin, label: "Pro-Grade Turf" }, { icon: Wifi, label: "LED Lighting" }, { icon: CalendarDays, label: "Locker Room" }, { icon: Wifi, label: "Free WiFi" }].map((f) => (
              <div key={f.label} className="rounded-2xl bg-surface p-6 text-center">
                <f.icon className="mx-auto h-6 w-6" />
                <p className="mt-4 text-base">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: Testimoni */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[38px] font-normal leading-[1.15] tracking-[-0.02em]">Kata Mereka</h2>
          <p className="mt-6 text-base leading-relaxed text-muted">Yang dikatakan pemain tentang CourtFlow.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[{ name: "Andi Pratama", text: "Gampang banget booking lapangan. Slot jelas, harga transparan. Nggak perlu ribet." },
            { name: "Bunga Lestari", text: "Aplikasi keren buat komunitas padel. Admin fast response, pembayaran aman." },
            { name: "Citra Dewi", text: "Desainnya simple dan premium. Suka banget sama fitur jadwal real-time." }].map((t) => (
            <div key={t.name} className="rounded-2xl bg-surface p-8">
              <p className="text-base leading-relaxed text-muted">&ldquo;{t.text}&rdquo;</p>
              <p className="mt-6 text-[13px] uppercase tracking-[0.08em]">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-2xl bg-surface p-8 text-center md:p-12">
          <h2 className="text-[38px] font-normal leading-[1.15] tracking-[-0.02em]">Siap untuk rally berikutnya?</h2>
          <Link href="/courts" className="mt-8 inline-flex rounded-full bg-primary px-8 py-4 text-base text-foreground">Mulai Booking</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground px-4 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          <Logo className="text-white [&_span:first-child]:border-white" />
          <p className="text-[13px] uppercase tracking-[0.08em]">Lapangan / Pemesanan / Pembayaran</p>
          <p className="text-[13px] uppercase tracking-[0.08em]">© 2026 CourtFlow</p>
        </div>
      </footer>
    </main>
  );
}
