import Link from "next/link";
import { challenges, pilots } from "@/lib/mock-data";
import { inr } from "@/lib/format";

export default function MyPilots() {
  const mine = pilots.filter((p) => p.startup_id === "s1");
  return (
    <section className="space-y-3"><h1 className="text-xl font-semibold">Ongoing pilots</h1>
      {mine.map((p) => <Link key={p.id} href={`/startup/my-pilots/${p.id}`} className="block rounded border bg-white p-4 hover:border-gov"><p className="font-medium">{challenges.find((c) => c.id === p.challenge_id)?.title}</p><p className="text-sm text-slate-600">{inr(p.grant_amount)} | {p.work_order_no}</p></Link>)}
    </section>
  );
}
