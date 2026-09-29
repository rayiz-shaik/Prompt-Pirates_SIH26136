"use client";
import { notFound } from "next/navigation";
import { useSession } from "@/store/useSession";
import { pilots } from "@/lib/mock-data";
import { inr } from "@/lib/format";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { MilestoneSubmit } from "@/components/startup/MilestoneSubmit";

export default function MyPilot({ params }: { params: { pilotId: string } }) {
  const milestones = useSession((s) => s.milestones);
  const pilot = pilots.find((p) => p.id === params.pilotId);
  if (!pilot) return notFound();
  const list = milestones.filter((m) => m.pilot_id === pilot.id);
  const released = list.filter((m) => m.status === "PAID").reduce((a, m) => a + m.amount, 0);
  return (
    <section className="rounded border bg-white p-5"><h1 className="text-xl font-semibold">{pilot.work_order_no}</h1>
      <p className="mt-1 text-sm text-slate-600">Paid out {inr(released)} | Held in escrow {inr(pilot.grant_amount - released)}</p>
      <ul className="mt-3 divide-y">{list.map((m) => <li key={m.id} className="flex items-center justify-between gap-3 py-3"><div><p className="font-medium">{m.title}</p><p className="text-sm text-slate-600">{m.kpi_target} | {inr(m.amount)}</p></div>
        <div className="flex items-center gap-3"><StatusBadge status={m.status} />{m.status === "PENDING" && <MilestoneSubmit milestone={m} />}</div></li>)}</ul></section>
  );
}
