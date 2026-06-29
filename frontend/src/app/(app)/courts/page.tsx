"use client";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Volleyball } from "lucide-react";
import { courts } from "@/lib/data";
import { CourtCard } from "@/components/CourtCard";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CourtsPage() {
  const [q, setQ] = useState("");

  const active = useMemo(() => courts.filter((c) => c.status === "active"), []);
  const filtered = active.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.location.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <div className="court-lines rounded-[28px] border border-border bg-surface p-5 shadow-[0_12px_30px_rgba(14,165,233,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-foreground">Find court</span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">Browse Courts</h1>
            <p className="mt-1 text-sm font-medium text-muted">{active.length} courts available. Pick date next, then grab a slot.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <div className="relative sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search court or location" className="pl-9" />
            </div>
            <div className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-bold text-muted">
              <SlidersHorizontal className="h-4 w-4 text-primary-hover" /> Active only
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={Volleyball}
          title="No courts found"
          description={`No courts match "${q}". Try another court or location.`}
        />
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => <CourtCard key={c.id} court={c} />)}
        </div>
      )}
    </div>
  );
}
