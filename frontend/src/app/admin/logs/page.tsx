"use client";
import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Workflow } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { formatDateTime } from "@/lib/format";

export default function AdminLogsPage() {
  const [status, setStatus] = useState("all");
  const [event, setEvent] = useState("all");
  const { data, loading, error } = useApi(() => api.admin.logs(), []);
  const filtered = useMemo(() => (data ?? []).filter((l) => {
    if (status !== "all" && l.status !== status) return false;
    if (event !== "all" && l.eventType !== event) return false;
    return true;
  }), [data, status, event]);

  if (loading) return <p className="py-20 text-center text-sm text-muted">Loading logs…</p>;
  if (error) return <p className="py-20 text-center text-sm text-red-600">{error}</p>;

  return (
    <div>
      <PageHeader title="Automation Logs" subtitle="n8n workflow execution results." />
      <div className="mb-5 flex flex-col gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-foreground/5 sm:flex-row">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48"><option value="all">All statuses</option><option value="success">Success</option><option value="failed">Failed</option></Select>
        <Select value={event} onChange={(e) => setEvent(e.target.value)} className="sm:w-56"><option value="all">All events</option><option value="booking_created">booking_created</option><option value="booking_confirmed">booking_confirmed</option><option value="booking_cancelled">booking_cancelled</option></Select>
      </div>
      {filtered.length === 0 ? <EmptyState icon={Workflow} title="No logs found" description="No automation logs match the selected filters." /> : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <div key={l.id} className={`rounded-xl bg-white p-4 shadow-sm ring-1 ${l.status === "failed" ? "ring-red-200" : "ring-foreground/5"}`}>
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${l.status === "failed" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>{l.status === "failed" ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-foreground">{l.workflowName}</h3><span className="rounded-md bg-foreground/5 px-2 py-0.5 font-mono text-xs text-muted">{l.eventType}</span><span className={`rounded-md px-2 py-0.5 text-xs font-medium ${l.status === "failed" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>{l.status}</span></div>
                  <p className={`mt-1 text-sm ${l.status === "failed" ? "text-red-600" : "text-muted"}`}>{l.message}</p>
                  <p className="mt-1.5 text-xs text-muted">{l.bookingId && <>Booking #{l.bookingId} · </>}{formatDateTime(l.executedAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
