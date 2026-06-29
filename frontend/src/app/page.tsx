import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Clock, MapPin, ShieldCheck, Smartphone } from "lucide-react";
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

      {/* Cara Booking — editorial numbered timeline */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-[11px] uppercase tracking-[0.12em]">Tiga langkah</span>
          <h2 className="mt-6 text-[38px] font-normal leading-[1.15] tracking-[-0.02em]">Dari pemilihan hingga servis pertama — dalam hitungan detik.</h2>
        </div>
        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {[{ num: "01", title: "Jelajahi & Pilih", desc: "Scan grid lapangan aktif. Harga per jam, foto lapangan, lokasi — semua di satu halaman. Filter berdasarkan nama atau lokasi." },
            { num: "02", title: "Tandai Slot", desc: "Grid waktu real-time. Klik slot kosong, sistem langsung menghitung total. Tidak perlu login untuk melihat ketersediaan." },
            { num: "03", title: "Konfirmasi & Main", desc: "Pilih metode bayar — transfer BCA atau gateway. Admin verifikasi manual, kamu dapat notifikasi otomatis." }].map((s) => (
            <div key={s.num} className="relative pl-14">
              <span className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border text-[13px]">{s.num}</span>
              <span className="absolute left-[17px] top-10 bottom-0 w-px bg-foreground/20 md:hidden" />
              <h3 className="text-lg">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fasilitas — spec-sheet 2-col */}
      <section className="border-y bg-surface">
        <div className="mx-auto grid max-w-7xl md:grid-cols-2">
          <div className="border-b md:border-b-0 md:border-r p-10">
            <span className="text-[13px] uppercase tracking-[0.12em] text-muted">Lapangan</span>
            <h2 className="mt-4 text-[32px] font-normal leading-[1.15] tracking-[-0.02em]">Standar turnamen, sensasi premium.</h2>
            <p className="mt-5 text-sm leading-relaxed text-muted">Setiap lapangan dirancang dengan material pro-grade. Pencahayaan LED 500 lux, surface 3-layer cushion, dan dinding panoramic glass.</p>
            <div className="mt-8 grid gap-3 text-sm">
              {["Pro-Grade Turf — 3-layer cushion", "LED Lighting — 500 lux coverage", "Panoramic Glass Walls", "Locker & Shower Room"].map((f) => (
                <div key={f} className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /><span>{f}</span></div>
              ))}
            </div>
          </div>
          <div className="p-10">
            <span className="text-[13px] uppercase tracking-[0.12em] text-muted">Layanan</span>
            <h2 className="mt-4 text-[32px] font-normal leading-[1.15] tracking-[-0.02em]">Booking dalam genggaman.</h2>
            <p className="mt-5 text-sm leading-relaxed text-muted">Sistem booking real-time tanpa login untuk melihat jadwal. Admin verifikasi dalam 1x24 jam.</p>
            <div className="mt-8 grid gap-3 text-sm">
              {["Real-time Slot Availability", "Admin Verification < 24 Jam", "Payment History & Receipts", "Auto Notification via Telegram"].map((f) => (
                <div key={f} className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /><span>{f}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimoni — industrial pull-quotes */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <span className="inline-block rounded-full bg-primary px-4 py-1.5 text-[11px] uppercase tracking-[0.12em]">Testimoni</span>
          <h2 className="mt-6 max-w-xl text-[38px] font-normal leading-[1.15] tracking-[-0.02em]">Yang pemain katakan tentang CourtFlow.</h2>
        </div>
        <div className="grid gap-0 md:grid-cols-3 border-t">
          {[{ name: "Andi Pratama", role: "Pengguna Aktif", text: "\"Gampang banget booking lapangan. Slot jelas, harga transparan. Nggak perlu ribet.\"" },
            { name: "Bunga Lestari", role: "Komunitas Padel", text: "\"Aplikasi keren buat komunitas padel. Admin fast response, pembayaran aman.\"" },
            { name: "Citra Dewi", role: "Pemain Reguler", text: "\"Desainnya simple dan premium. Suka banget sama fitur jadwal real-time.\"" }].map((t, i) => (
            <div key={t.name} className={`p-10 ${i < 2 ? "border-b md:border-b-0 md:border-r" : ""}`}>
              <p className="text-base leading-relaxed text-foreground">{t.text}</p>
              <div className="mt-8 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-foreground grid place-items-center text-white text-[13px] uppercase">{t.name[0]}</div>
                <div><p className="text-[13px] uppercase tracking-[0.08em]">{t.name}</p><p className="text-[11px] uppercase tracking-[0.08em] text-muted">{t.role}</p></div>
              </div>
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
