"use client";
import Link from "next/link";
import { useSession } from "@/store/useSession";
import { inr } from "@/lib/format";

export default function Challenges() {
  const challenges = useSession((s) => s.challenges);
  return (
    <section className="space-y-3"><div className="flex items-center justify-between"><h1 className="text-xl font-semibold">Floated challenges</h1>
      <Link href="/officer/challenges/new" className="rounded bg-gov px-4 py-2 text-white">New challenge</Link></div>
      {challenges.map((c) => <Link key={c.id} href={`/officer/challenges/${c.id}`} className="block rounded border bg-white p-4 hover:border-gov"><p className="font-medium">{c.title}</p><p className="text-sm text-slate-600">{inr(c.budget_cap)} | {c.max_weeks} weeks | TRL {c.min_trl}+</p></Link>)}
    </section>
  );
}
