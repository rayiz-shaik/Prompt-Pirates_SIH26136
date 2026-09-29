"use client";
import Link from "next/link";
import { useSession } from "@/store/useSession";
import { pilots } from "@/lib/mock-data";
import { inr } from "@/lib/format";

export default function OfficerDashboard() {
  const { milestones, challenges } = useSession();
  const released = milestones.filter((m) => m.status === "PAID").reduce((a, m) => a + m.amount, 0);
  const pending = milestones.filter((m) => m.status === "SUBMITTED");
  const grant = pilots[0].grant_amount;
  return (
    <div className="space-y-4">
      <section className="grid gap-4 sm:grid-cols-3">
        {[["Active pilots", String(pilots.length)], ["Open challenges", String(challenges.filter((c) => c.status === "PUBLISHED").length)], ["Budget used", `${inr(released)} of ${inr(grant)}`]].map(([k, v]) => (
          <div key={k} className="rounded border bg-white p-4"><p className="text-sm text-slate-600">{k}</p><p className="text-xl font-semibold">{v}</p></div>))}
      </section>
      <section className="rounded border bg-white p-4"><h2 className="font-semibold">Needs your action</h2>
        {pending.length === 0 ? <p className="mt-2 text-slate-600">Nothing awaits verification.</p> :
          pending.map((m) => <p key={m.id} className="mt-2"><Link className="underline" href={`/officer/pilots/${m.pilot_id}`}>Verify: {m.title}</Link></p>)}</section>
    </div>
  );
}
