"use client";
import { useState } from "react";
import { useSession } from "@/store/useSession";
import { inr, sha256 } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function MilestoneConsole() {
  const { milestones, updateMilestone, addLog } = useSession();
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const queue = milestones.filter((m) => m.status === "SUBMITTED");

  // Release requires a written remark: good audit practice requires a recorded basis for every milestone payment.
  async function signOff(id: string, amount: number) {
    const note = remarks[id]?.trim() ?? "";
    const verified_at = new Date().toISOString();
    const hash = await sha256(`${id}|${note}|${verified_at}|u1`);
    updateMilestone(id, { status: "PAID", officer_notes: note, verified_at });
    addLog({ entity_name: "pilot_milestones", entity_id: id, action: `Verified; ${inr(amount)} released from escrow`, performed_by: "u1", legal_basis: "Contract milestone-payment clause", hash });
  }
  return (
    <section className="rounded border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold">Milestone verification queue</h2>
      {queue.length === 0 && <p className="mt-3 text-slate-600">No milestones are awaiting verification. Submissions from startups will appear here.</p>}
      {queue.map((m) => (
        <div key={m.id} className="mt-4 space-y-2 border-t pt-4">
          <div className="flex items-center justify-between"><p className="font-medium">{m.title}</p><StatusBadge status={m.status} /></div>
          <p className="text-sm text-slate-600">Target: {m.kpi_target} | Evidence: {m.evidence_url}</p>
          <textarea aria-label="Vigilance inspection remarks" rows={2} placeholder="Record what you physically inspected (min. 20 characters)" className="w-full rounded border border-slate-300 px-3 py-2"
            value={remarks[m.id] ?? ""} onChange={(e) => setRemarks({ ...remarks, [m.id]: e.target.value })} />
          <button disabled={(remarks[m.id]?.trim().length ?? 0) < 20} onClick={() => signOff(m.id, m.amount)}
            className="rounded bg-emerald-700 px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-300">Sign off and release {inr(m.amount)}</button>
        </div>
      ))}
    </section>
  );
}
