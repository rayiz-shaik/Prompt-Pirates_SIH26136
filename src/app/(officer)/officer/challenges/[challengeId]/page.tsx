"use client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useSession } from "@/store/useSession";
import { inr } from "@/lib/format";

export default function ChallengeDetail({ params }: { params: { challengeId: string } }) {
  const c = useSession((s) => s.challenges.find((x) => x.id === params.challengeId));
  const proposals = useSession((s) => s.proposals);
  if (!c) return notFound();
  const received = proposals.filter((p) => p.challenge_id === c.id);
  return (
    <div className="space-y-4">
      <section className="rounded border bg-white p-5"><h1 className="text-xl font-semibold">{c.title}</h1><p className="mt-2">{c.narrative}</p>
        <p className="mt-2 text-sm text-slate-600">Outcome: {c.outcome_kpi} | Cap {inr(c.budget_cap)}</p></section>
      <section className="rounded border bg-white p-5"><h2 className="font-semibold">Proposals received (identities hidden)</h2>
        {received.length === 0 && <p className="mt-2 text-slate-600">No proposals yet.</p>}
        {received.map((p) => <p key={p.id} className="mt-2"><Link className="underline" href={`/officer/challenges/${c.id}/proposals/${p.id}`}>Proposal #{p.id}</Link> quoted {inr(p.cost)}</p>)}</section>
    </div>
  );
}
