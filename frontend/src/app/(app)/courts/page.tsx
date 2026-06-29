"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CourtCard } from "@/components/CourtCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { courts } from "@/lib/data";

export default function CourtsPage() {
  const [q, setQ] = useState("");
  const active = useMemo(() => courts.filter((c) => c.status === "active"), []);
  const filtered = active.filter((c) => `${c.name} ${c.location}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <section className="pb-10">
        <p className="text-[13px] uppercase tracking-[0.12em] text-muted">Daftar Lapangan</p>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
          <h1 className="max-w-3xl text-[44px] font-normal leading-[1.05] tracking-[-0.04em] md:text-[72px]">Pilih lapangan favorit Anda.</h1>
          <div className="relative"><Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari lapangan atau kota" className="pl-14" aria-label="Cari lapangan atau kota" /></div>
        </div>
      </section>
      {filtered.length === 0 ? <EmptyState className="mt-8" icon={Search} title="Lapangan tidak ditemukan" description="Coba nama atau lokasi lain." /> : <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((court) => <CourtCard key={court.id} court={court} />)}</section>}
    </div>
  );
}
