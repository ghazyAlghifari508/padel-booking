"use client";
import { useState } from "react";
import { Ban, Clock, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { blockedTimes as seedBlocked, courts, operatingHours } from "@/lib/data";
import { formatDate } from "@/lib/format";
import type { BlockedTime } from "@/lib/types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminSchedulePage() {
  const active = courts.filter((c) => c.status === "active");
  const [courtId, setCourtId] = useState(active[0]?.id ?? 1);
  const [blocked, setBlocked] = useState<BlockedTime[]>(seedBlocked);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ date: "", startTime: "08:00", endTime: "09:00", reason: "" });
  const hours = operatingHours.filter((h) => h.courtId === courtId);

  const addBlock = () => {
    const court = courts.find((c) => c.id === courtId)!;
    setBlocked((prev) => [...prev, { id: Date.now(), courtId, courtName: court.name, ...draft }]);
    setAdding(false);
    setDraft({ date: "", startTime: "08:00", endTime: "09:00", reason: "" });
  };

  return (
    <div>
      <PageHeader title="Schedule & Blocked Time" subtitle="Operating lanes, closures, and maintenance blocks." />
      <div className="mb-5 w-full sm:w-80"><Field label="Select court" htmlFor="court"><Select id="court" value={courtId} onChange={(e) => setCourtId(Number(e.target.value))}>{active.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field></div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="twotwo-card rounded-2xl p-5"><h2 className="flex items-center gap-2 font-normal text-foreground"><Clock className="h-5 w-5 text-foreground" /> Operating hours</h2><div className="mt-4 space-y-2">{hours.map((h) => <div key={h.dayOfWeek} className="flex items-center justify-between rounded-2xl border border-border bg-muted-surface px-3 py-2.5 text-sm"><span className="font-normal text-foreground">{DAYS[h.dayOfWeek]}</span>{h.closed ? <span className="font-normal text-status-cancelled">Closed</span> : <span className="tabular-nums font-normal text-muted">{h.openTime} – {h.closeTime}</span>}</div>)}</div></div>
        <div className="twotwo-card rounded-2xl p-5"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-normal text-foreground"><Ban className="h-5 w-5 text-status-cancelled" /> Blocked time</h2><Button size="sm" onClick={() => setAdding(true)}><Plus className="h-4 w-4" /> Add</Button></div><div className="mt-4 space-y-2">{blocked.filter((b) => b.courtId === courtId).length === 0 ? <p className="rounded-2xl border border-dashed border-border bg-muted-surface px-3 py-4 text-center text-sm font-medium text-muted">No blocked time for this court.</p> : blocked.filter((b) => b.courtId === courtId).map((b) => <div key={b.id} className="flex items-center justify-between rounded-2xl border border-dashed border-status-cancelled/30 bg-status-cancelled-soft/40 px-3 py-2.5 text-sm"><div><p className="font-normal text-foreground">{formatDate(b.date)} · {b.startTime}–{b.endTime}</p><p className="text-xs font-medium text-muted">{b.reason}</p></div><button onClick={() => setBlocked((p) => p.filter((x) => x.id !== b.id))} aria-label="Remove" className="cursor-pointer rounded-full p-2 text-muted hover:bg-status-cancelled-soft hover:text-status-cancelled"><Trash2 className="h-4 w-4" /></button></div>)}</div></div>
      </div>
      <Modal open={adding} onClose={() => setAdding(false)} title="Add blocked time"><div className="flex flex-col gap-4"><Field label="Date" htmlFor="bdate" required><Input id="bdate" type="date" value={draft.date} onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))} /></Field><div className="grid grid-cols-2 gap-3"><Field label="Start" htmlFor="bstart" required><Input id="bstart" type="time" value={draft.startTime} onChange={(e) => setDraft((d) => ({ ...d, startTime: e.target.value }))} /></Field><Field label="End" htmlFor="bend" required><Input id="bend" type="time" value={draft.endTime} onChange={(e) => setDraft((d) => ({ ...d, endTime: e.target.value }))} /></Field></div><Field label="Reason" htmlFor="breason"><Input id="breason" value={draft.reason} onChange={(e) => setDraft((d) => ({ ...d, reason: e.target.value }))} placeholder="Maintenance, tournament…" /></Field></div><div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button><Button onClick={addBlock} disabled={!draft.date}>Add blocked time</Button></div></Modal>
    </div>
  );
}
