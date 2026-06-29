"use client";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { CourtCard } from "@/components/CourtCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { courts } from "@/lib/data";

const LOCATIONS = ["Semua", ...Array.from(new Set(courts.map((c) => c.location)))];

export default function CourtsPage() {
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("Semua");

  const active = useMemo(() => courts.filter((c) => c.status === "active"), []);
  const filtered = active.filter((c) => {
    const matchQ = `${c.name} ${c.location}`.toLowerCase().includes(q.toLowerCase());
    const matchLoc = loc === "Semua" || c.location === loc;
    return matchQ && matchLoc;
  });

  return (
    <div className="flex gap-0 md:gap-6">
      {/* Sidebar filter */}
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-24 rounded-xl border border-black/10 bg-surface p-4">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filter
          </p>
          <p className="mb-1.5 text-xs font-semibold text-muted">Lokasi</p>
          <div className="flex flex-col gap-1">
            {LOCATIONS.map((l) => (
              <button
                key={l}
                onClick={() => setLoc(l)}
                className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  loc === l
                    ? "bg-foreground text-white"
                    : "text-foreground hover:bg-muted-surface"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1">
        {/* Topbar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Pilih Lapangan</h1>
            <p className="text-sm text-muted">{filtered.length} lapangan tersedia</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama atau lokasi…"
              className="h-9 w-full rounded-lg border border-black/10 bg-surface pl-9 pr-3 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Cari lapangan"
            />
          </div>
        </div>

        {/* Mobile location chips */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {LOCATIONS.map((l) => (
            <button
              key={l}
              onClick={() => setLoc(l)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                loc === l ? "bg-foreground text-white" : "bg-surface border border-black/10 text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Tidak ditemukan"
            description="Coba nama atau lokasi lain."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
