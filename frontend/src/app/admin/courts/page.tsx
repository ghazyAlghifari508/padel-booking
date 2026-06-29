"use client";
import Image from "next/image";
import { useState } from "react";
import { Pencil, Plus, Power } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { courts as seed } from "@/lib/data";
import { formatIDR } from "@/lib/format";
import type { Court } from "@/lib/types";

type Draft = Partial<Court>;

export default function AdminCourtsPage() {
  const [courts, setCourts] = useState<Court[]>(seed);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openNew = () => { setErrors({}); setEditing({ status: "active", pricePerHour: 0 }); };
  const openEdit = (c: Court) => { setErrors({}); setEditing(c); };

  const save = () => {
    const e: Record<string, string> = {};
    if (!editing?.name) e.name = "Name is required.";
    if (editing?.pricePerHour == null || editing.pricePerHour < 0) e.price = "Price must be ≥ 0.";
    if (!editing?.status) e.status = "Status is required.";
    setErrors(e);
    if (Object.keys(e).length) return;

    setCourts((prev) => {
      if (editing!.id) return prev.map((c) => (c.id === editing!.id ? { ...c, ...editing } as Court : c));
      return [...prev, { id: Math.max(...prev.map((c) => c.id)) + 1, name: editing!.name!, description: editing!.description ?? "", location: editing!.location ?? "", pricePerHour: editing!.pricePerHour!, imageUrl: editing!.imageUrl || "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=70", status: editing!.status as Court["status"] }];
    });
    setEditing(null);
  };

  const toggleStatus = (id: number) => setCourts((prev) => prev.map((c) => (c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c)));

  return (
    <div>
      <PageHeader title="Court Management" subtitle={`${courts.length} courts · ${courts.filter((c) => c.status === "active").length} active`} action={<Button onClick={openNew}><Plus className="h-4 w-4" /> New court</Button>} />
      <div className="twotwo-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="court-lines bg-muted-surface text-left text-xs font-normal uppercase tracking-[0.08em] text-muted"><tr><th className="px-4 py-3">Court</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Price/hr</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Actions</th></tr></thead>
            <tbody className="divide-y divide-border">
              {courts.map((c) => (
                <tr key={c.id} className="hover:bg-muted-surface/50">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><span className="relative h-11 w-11 overflow-hidden rounded-2xl"><Image src={c.imageUrl} alt="" fill sizes="44px" className="object-cover" /></span><span className="font-normal text-foreground">{c.name}</span></div></td>
                  <td className="px-4 py-3 font-medium text-muted">{c.location || "—"}</td>
                  <td className="px-4 py-3 font-normal tabular-nums text-foreground">{formatIDR(c.pricePerHour)}</td>
                  <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-normal ${c.status === "active" ? "bg-primary text-foreground" : "bg-status-expired-soft text-status-expired"}`}>{c.status}</span></td>
                  <td className="px-4 py-3"><div className="flex items-center justify-end gap-1"><button onClick={() => openEdit(c)} aria-label="Edit" className="cursor-pointer rounded-full p-2 text-muted hover:bg-muted-surface hover:text-foreground"><Pencil className="h-4 w-4" /></button><button onClick={() => toggleStatus(c.id)} aria-label="Toggle status" className="cursor-pointer rounded-full p-2 text-muted hover:bg-primary hover:text-foreground"><Power className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing?.id ? "Edit court" : "New court"}>
        <div className="flex flex-col gap-4">
          <Field label="Court name" htmlFor="name" required error={errors.name}><Input id="name" value={editing?.name ?? ""} onChange={(e) => setEditing((d) => ({ ...d, name: e.target.value }))} placeholder="Court Sky A" /></Field>
          <Field label="Location" htmlFor="loc"><Input id="loc" value={editing?.location ?? ""} onChange={(e) => setEditing((d) => ({ ...d, location: e.target.value }))} placeholder="CourtFlow Arena, Jakarta" /></Field>
          <Field label="Description" htmlFor="desc"><Input id="desc" value={editing?.description ?? ""} onChange={(e) => setEditing((d) => ({ ...d, description: e.target.value }))} placeholder="Indoor court with bright turf…" /></Field>
          <div className="grid grid-cols-2 gap-3"><Field label="Price / hour (IDR)" htmlFor="price" required error={errors.price}><Input id="price" type="number" min={0} value={editing?.pricePerHour ?? 0} onChange={(e) => setEditing((d) => ({ ...d, pricePerHour: Number(e.target.value) }))} /></Field><Field label="Status" htmlFor="status" required error={errors.status}><Select id="status" value={editing?.status ?? "active"} onChange={(e) => setEditing((d) => ({ ...d, status: e.target.value as Court["status"] }))}><option value="active">Active</option><option value="inactive">Inactive</option></Select></Field></div>
        </div>
        <div className="mt-5 flex justify-end gap-2"><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save}>{editing?.id ? "Save changes" : "Create court"}</Button></div>
      </Modal>
    </div>
  );
}
