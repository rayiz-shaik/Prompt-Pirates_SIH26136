"use client";
import { useMemo, useState } from "react";
import { toBlindProposals } from "@/lib/mock-data";
import { inr } from "@/lib/format";
import { useSession } from "@/store/useSession";
import type { RubricScores } from "@/types";

const CRITERIA: { key: keyof RubricScores; label: string }[] = [
  { key: "feasibility", label: "Feasibility" }, { key: "methodology", label: "Methodology" },
  { key: "costEffectiveness", label: "Cost-effectiveness" }, { key: "trlAlignment", label: "TRL alignment" },
];
const blank: RubricScores = { feasibility: 0, methodology: 0, costEffectiveness: 0, trlAlignment: 0 };
const total = (s: RubricScores) => s.feasibility + s.methodology + s.costEffectiveness + s.trlAlignment;

export function BlindScoring({ only }: { only?: string }) {
  const { proposals, challenges, scores, lockScore, addLog } = useSession();
  // Only the scrubbed projection is ever rendered here; bidder identity is unreachable from this view.
  const blind = useMemo(() => toBlindProposals(proposals, challenges).filter((p) => !only || p.proposalId === only), [proposals, challenges, only]);
  const [draft, setDraft] = useState<Record<string, RubricScores>>({});
  if (blind.length === 0) return <p className="rounded border bg-white p-5 text-slate-600">No proposals to evaluate yet.</p>;

  return (
    <div className="space-y-4">
      {blind.map((p) => {
        const locked = scores[p.proposalId];
        const s = locked ?? draft[p.proposalId] ?? blank;
        const complete = Object.values(s).every((v) => v >= 1);
        return (
          <section key={p.proposalId} className="rounded border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold">{p.alias}</h2>
            <p className="text-sm text-slate-600">{p.challengeTitle} | Quoted {inr(p.cost)}</p>
            <p className="mt-2">{p.methodology}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-4">
              {CRITERIA.map((c) => (
                <label key={c.key} className="text-sm font-medium">{c.label} (1-10)
                  <input type="number" min={1} max={10} disabled={!!locked} value={s[c.key] || ""} className="mt-1 w-full rounded border border-slate-300 px-2 py-1"
                    onChange={(e) => setDraft({ ...draft, [p.proposalId]: { ...s, [c.key]: Math.min(10, Math.max(0, Number(e.target.value))) } })} />
                </label>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4">
              <span className="font-medium">Total: {total(s)} / 40</span>
              <button disabled={!complete || !!locked} className="rounded bg-gov px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                onClick={() => { lockScore(p.proposalId, s); addLog({ entity_name: "proposals", entity_id: p.proposalId, action: `Blind score locked: ${total(s)}/40`, performed_by: "u3", legal_basis: "CVC transparency guidelines" }); }}>
                {locked ? "Score locked" : "Lock score"}</button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
