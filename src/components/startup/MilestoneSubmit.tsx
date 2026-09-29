"use client";
import { useState } from "react";
import type { PilotMilestone } from "@/types";
import { useSession } from "@/store/useSession";

export function MilestoneSubmit({ milestone }: { milestone: PilotMilestone }) {
  const { updateMilestone, addLog } = useSession();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const valid = file !== null && result.trim().length >= 10;

  function submit() {
    if (!file) return;
    updateMilestone(milestone.id, { status: "SUBMITTED", evidence_url: file.name });
    addLog({ entity_name: "pilot_milestones", entity_id: milestone.id, action: `Deliverable submitted (${file.name}); reported result: ${result.trim()}`, performed_by: "s1", legal_basis: "Milestone-linked payment clause" });
    setOpen(false);
  }
  if (!open) return <button onClick={() => setOpen(true)} className="rounded bg-gov px-3 py-1.5 text-sm text-white">Submit test logs</button>;
  return (
    <div className="w-72 space-y-2 text-sm">
      <input type="file" accept=".zip,.csv,.log,.pdf" aria-label="Test log file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <input value={result} onChange={(e) => setResult(e.target.value)} placeholder={`Result against: ${milestone.kpi_target}`} className="w-full rounded border border-slate-300 px-2 py-1" />
      <div className="flex gap-2">
        <button disabled={!valid} onClick={submit} className="rounded bg-gov px-3 py-1.5 text-white disabled:cursor-not-allowed disabled:bg-slate-300">Submit for verification</button>
        <button onClick={() => setOpen(false)} className="rounded border px-3 py-1.5">Cancel</button>
      </div>
    </div>
  );
}
