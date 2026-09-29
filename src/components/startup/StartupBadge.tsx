"use client";
import { useSession } from "@/store/useSession";
import { findStartupByUser, pilots } from "@/lib/mock-data";
import { inr } from "@/lib/format";

export function StartupBadge() {
  const milestones = useSession((s) => s.milestones);
  const me = findStartupByUser("u2"); // single seeded startup account in the demo
  const paid = milestones.filter((m) => m.status === "PAID").reduce((a, m) => a + m.amount, 0);
  return (
    <div className="rounded bg-white/10 p-3 text-xs">
      <p className="font-semibold text-emerald-300">DPIIT verified: {me?.dpiit_number}</p>
      <p>Wallet: {inr(paid)} received of {inr(pilots[0].grant_amount)}</p>
    </div>
  );
}
