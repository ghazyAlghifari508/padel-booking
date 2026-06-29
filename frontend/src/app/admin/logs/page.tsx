"use client";
import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Workflow } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Input";
import { automationLogs } from "@/lib/data";
import { formatDateTime } from "@/lib/format";

export default function AdminLogsPage() {
  const [status, setStatus] = useState("all");
  const [event, setEvent] = useState("all");
  const filtered = useMemo(() => automationLogs.filter((l) => {
    if (status !== "all" && l.status !== status) return false;
    if (event !== "all" && l.eventType !== event) return false;
    return true;
  }), [status, event]);

  return (
    <div>
      <PageHeader title="Automation Logs" subtitle="n8n workflow execution results." />
      <div className="sky-card mb-5 flex flex-col gap-3 rounded-[24px] p-3 sm:flex-row">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48"><option value="all">All statuses</option><option value="success">Success</option><option value="failed">Failed</option></Select>
        <Select value={event} onChange={(e) => setEvent(e.target.value)} className="sm:w-56"><option value="all">All events</option><option value="booking_created">booking_created</option><option value="booking_confirmed">booking_confirmed</option><option value="booking_cancelled">booking_cancelled</option></Select>
      </div>
      {filtered.length === 0 ? <EmptyState icon={Workflow} title="No logs found" description="No automation logs match the selected filters." /> : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <div key={l.id} className={`rounded-[24px] border bg-surface p-4 shadow-[0_12px_30px_rgba(14,165,233,0.08)] ${l.status === "failed" ? "border-status-cancelled/30" : "border-border"}`}>
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${l.status === "failed" ? "bg-status-cancelled-soft text-status-cancelled" : "bg-status-confirmed text-white"}`}>{l.status === "failed" ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h3 className="font-extrabold text-foreground">{l.workflowName}</h3><span className="rounded-full bg-accent px-2 py-0.5 font-mono text-xs font-bold text-foreground">{l.eventType}</span><span className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${l.status === "failed" ? "bg-status-cancelled-soft text-status-cancelled" : "bg-status-confirmed-soft text-status-confirmed"}`}>{l.status}</span></div>
                  <p className={`mt-1 text-sm ${l.status === "failed" ? "font-bold text-status-cancelled" : "font-medium text-muted"}`}>{l.message}</p>
                  <p className="mt-1.5 text-xs font-medium text-muted">{l.bookingId && <>Booking #{l.bookingId} · </>}{formatDateTime(l.executedAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
