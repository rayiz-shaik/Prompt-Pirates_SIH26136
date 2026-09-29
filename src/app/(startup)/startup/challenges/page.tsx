"use client";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/store/useSession";
import { getDepartmentName } from "@/lib/mock-data";
import { inr } from "@/lib/format";

export default function Market() {
  const challenges = useSession((s) => s.challenges);
  const [q, setQ] = useState("");
  const shown = challenges.filter((c) => c.status === "PUBLISHED" && `${c.title} ${c.narrative}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <section className="space-y-3"><h1 className="text-xl font-semibold">Government challenges</h1>
      <input aria-label="Search challenges" placeholder="Search by keyword" value={q} onChange={(e) => setQ(e.target.value)} className="w-full rounded border border-slate-300 px-3 py-2" />
      {shown.length === 0 && <p className="text-slate-600">No challenges match your search. Try a broader keyword.</p>}
      {shown.map((c) => <div key={c.id} className="flex items-start justify-between gap-3 rounded border bg-white p-4"><div><p className="font-medium">{c.title}</p>
        <p className="text-sm text-slate-600">{getDepartmentName(c.dept_id)} | Up to {inr(c.budget_cap)} | {c.max_weeks} weeks | TRL {c.min_trl}+</p><p className="text-sm">Outcome: {c.outcome_kpi}</p></div>
        <Link href={`/startup/challenges/${c.id}/apply`} className="shrink-0 rounded border border-gov px-3 py-1.5 text-sm text-gov">Apply</Link></div>)}
    </section>
  );
}
