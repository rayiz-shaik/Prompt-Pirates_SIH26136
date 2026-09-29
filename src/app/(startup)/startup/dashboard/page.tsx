"use client";
import Link from "next/link";
import { useSession } from "@/store/useSession";
import { findStartupByUser } from "@/lib/mock-data";
import { inr } from "@/lib/format";

export default function StartupDashboard() {
  const { challenges, milestones } = useSession();
  const me = findStartupByUser("u2");
  if (!me) return <p role="alert">Startup profile not found.</p>;
  const badge = "rounded bg-emerald-100 px-2 py-1 text-emerald-800";
  return (
    <div className="space-y-4">
      <section className="rounded border bg-white p-5"><h1 className="text-xl font-semibold">{me.company_name}</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium"><span className={badge}>DPIIT: {me.dpiit_number}</span>
          {me.is_turnover_exempted && <span className={badge}>Turnover waived</span>}{me.is_emd_exempted && <span className={badge}>EMD exempted</span>}</div></section>
      <section className="rounded border bg-white p-5"><h2 className="font-semibold">Open bids to consider</h2>
        {challenges.filter((c) => c.status === "PUBLISHED").map((c) => <p key={c.id} className="mt-2"><Link className="underline" href={`/startup/challenges/${c.id}/apply`}>{c.title}</Link> up to {inr(c.budget_cap)}</p>)}</section>
      <section className="rounded border bg-white p-5"><h2 className="font-semibold">Pilot tracking</h2>
        <p className="mt-2">{milestones.filter((m) => m.status === "SUBMITTED").length} milestone(s) awaiting department verification. <Link className="underline" href="/startup/my-pilots">Open my pilots</Link></p></section>
    </div>
  );
}
