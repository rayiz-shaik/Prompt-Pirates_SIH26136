"use client";
import { notFound } from "next/navigation";
import { useSession } from "@/store/useSession";
import { pilots } from "@/lib/mock-data";
import { inr } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MilestoneConsole } from "@/components/officer/MilestoneConsole";
import { AuditDefenseDossier } from "@/components/auditor/AuditDefenseDossier";

export default function PilotDetail({ params }: { params: { pilotId: string } }) {
  const milestones = useSession((s) => s.milestones);
  const pilot = pilots.find((p) => p.id === params.pilotId);
  if (!pilot) return notFound();
  return (
    <div className="space-y-4">
      <section className="rounded border bg-white p-5"><h1 className="text-xl font-semibold">{pilot.work_order_no}</h1><p className="text-sm text-slate-600">Sanctioned {inr(pilot.grant_amount)}</p>
        <ul className="mt-3 divide-y">{milestones.filter((m) => m.pilot_id === pilot.id).map((m) => <li key={m.id} className="flex justify-between py-2"><span>{m.index}. {m.title} ({inr(m.amount)})</span><StatusBadge status={m.status} /></li>)}</ul></section>
      <MilestoneConsole /><div><AuditDefenseDossier /></div>
    </div>
  );
}
