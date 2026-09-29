"use client";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Challenge, StartupProfile } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { useSession } from "@/store/useSession";
import { inr, sha256 } from "@/lib/format";

interface Props { challenge: Challenge; profile: StartupProfile; onClose: () => void }

export function ProposalModal({ challenge, profile, onClose }: Props) {
  const addLog = useSession((s) => s.addLog);
  const addProposal = useSession((s) => s.addProposal);
  const count = useSession((s) => s.proposals.length);
  const already = useSession((s) => s.proposals.some((p) => p.challenge_id === challenge.id && p.startup_id === profile.id));
  const [receipt, setReceipt] = useState<string | null>(null);
  const eligible = profile.trl_level >= challenge.min_trl;

  // The cap is per-challenge, so the schema is derived from the challenge rather than hard-coded.
  const schema = useMemo(() => z.object({
    methodology: z.string().min(40, "Describe your approach in at least 40 characters"),
    cost: z.coerce.number().positive("Enter your quoted cost")
      .max(challenge.budget_cap, `Quote exceeds this challenge's cap of ${inr(challenge.budget_cap)}`),
    ipWaiver: z.boolean().refine((v) => v, "Accept the IP protection clause to apply"),
    bidSecurity: z.boolean().refine((v) => v, "Sign the Bid Security Declaration (replaces EMD)"),
  }), [challenge.budget_cap]);
  type Values = z.infer<typeof schema>;

  const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } =
    useForm<Values>({ resolver: zodResolver(schema), mode: "onChange", defaultValues: { ipWaiver: false, bidSecurity: false } });

  // The hash binds startup, challenge and terms at submission time. It records that IP stays with the
  // startup (Maharashtra Startup Policy 2018); the department receives a licence to evaluate only.
  const onSubmit = handleSubmit(async (v) => {
    const hash = await sha256(`${challenge.id}|${profile.id}|${v.methodology}|${v.cost}|IP-PROTECTION-WAIVER`);
    addProposal({ id: `MH-2026-${String(count + 1).padStart(3, "0")}`, challenge_id: challenge.id, startup_id: profile.id, methodology: v.methodology, cost: v.cost, score: null, is_shortlisted: false });
    addLog({ entity_name: "proposals", entity_id: `${challenge.id}:${profile.id}`, action: `Proposal submitted at ${inr(v.cost)}; IP protection waiver hashed`, performed_by: profile.id, legal_basis: "Maharashtra Startup Policy 2018 (IP retained by startup)", hash });
    setReceipt(hash);
  });

  const box = "mt-1 w-full rounded border border-slate-300 px-3 py-2";
  return (
    <Modal title={`Apply: ${challenge.title}`} onClose={onClose}>
      {receipt ? (
        <div className="space-y-2"><p className="font-medium text-emerald-800">Proposal submitted. Your identity is hidden from evaluators.</p>
          <p className="break-all font-mono text-xs">IP waiver receipt: {receipt}</p>
          <button onClick={onClose} className="rounded bg-gov px-4 py-2 text-white">Close</button></div>
      ) : already ? (
        <p role="alert" className="text-amber-800">Your company has already applied to this challenge.</p>
      ) : !eligible ? (
        <p role="alert" className="text-red-700">Your solution is at TRL {profile.trl_level}; this challenge requires TRL {challenge.min_trl} or higher.</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <p className="text-sm text-slate-600">Turnover and EMD requirements are waived for your DPIIT registration ({profile.dpiit_number}).</p>
          <label className="block text-sm font-medium">Methodology<textarea rows={4} className={box} {...register("methodology")} />
            {errors.methodology && <span role="alert" className="text-red-700">{errors.methodology.message}</span>}</label>
          <label className="block text-sm font-medium">Quoted cost (₹)<input type="number" className={box} {...register("cost")} />
            {errors.cost && <span role="alert" className="text-red-700">{errors.cost.message}</span>}</label>
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" {...register("ipWaiver")} />
            <span>I accept that the department gets an evaluation-only licence and my IP stays with my company.</span></label>
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" {...register("bidSecurity")} /><span>I sign the Bid Security Declaration: if I withdraw or alter my bid, I accept suspension as set in the tender terms. No EMD is payable (GFR Rule 170(i)).</span></label>
          <button disabled={!isValid || isSubmitting} className="rounded bg-gov px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-300">Submit proposal</button>
        </form>
      )}
    </Modal>
  );
}
