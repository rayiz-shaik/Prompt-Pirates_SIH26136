"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "@/store/useSession";
import { PILOT_CAP } from "@/lib/mock-data";
import { inr } from "@/lib/format";

// GFR Rule 144 requires generic, functional specifications, so technology or brand prescriptions are rejected.
const PRESCRIPTIVE = /\b(drone|dji|raspberry|sensor model|lidar)\b/i;

const schema = z.object({
  title: z.string().min(10, "Title must describe the civic problem in at least 10 characters"),
  narrative: z.string().min(40, "Describe the citizen-facing problem in at least 40 characters"),
  outcome_kpi: z.string().min(15, "State a measurable outcome, e.g. 'reduce response time below 30 minutes'")
    .refine((v) => !PRESCRIPTIVE.test(v), "Specify the outcome, not the hardware. GFR Rule 144 requires generic, functional specifications")
    .refine((v) => /\d/.test(v), "Outcome must contain a measurable number (%, minutes, km, count)"),
  budget_cap: z.coerce.number().positive("Enter a budget")
    .max(PILOT_CAP, `Pilot work orders are limited to ${inr(PILOT_CAP)} under the MSInS programme (Maharashtra Startup Policy 2018)`),
  max_weeks: z.coerce.number().int().min(4, "Minimum 4 weeks for a meaningful pilot").max(26, "Pilots beyond 26 weeks must go through scale-up procurement"),
  min_trl: z.coerce.number().int().min(1).max(9),
  gemChecked: z.boolean().refine((v) => v, "Confirm a GeM search found no equivalent listing (GFR Rule 149)"),
});
type FormValues = z.infer<typeof schema>;

export function ChallengeWizard() {
  const addChallenge = useSession((s) => s.addChallenge);
  const addLog = useSession((s) => s.addLog);
  const { register, handleSubmit, watch, reset, formState: { errors, isValid, isDirty, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema), mode: "onChange", defaultValues: { min_trl: 5, max_weeks: 12, gemChecked: false } });
  const budget = Number(watch("budget_cap")) || 0;

  const onSubmit = handleSubmit((v) => {
    const id = `c${Date.now()}`;
    const { gemChecked, ...fields } = v;
    addChallenge({ ...fields, id, dept_id: "d1", status: "PUBLISHED" });
    addLog({ entity_name: "challenges", entity_id: id, action: `Challenge published: ${v.title} (GeM availability check declared: ${gemChecked ? "yes" : "no"})`, performed_by: "u1", legal_basis: "Maharashtra Startup Policy 2018 (MSInS pilot work order); GFR Rules 144 and 149" });
    reset();
  });

  const field = "mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2";
  const err = (m?: string) => m && <p role="alert" className="mt-1 text-sm text-red-700">{m}</p>;
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded border border-slate-200 bg-white p-5" noValidate>
      <h2 className="text-lg font-semibold">Publish an outcome-based challenge</h2>
      <label className="block text-sm font-medium">Challenge title<input className={field} {...register("title")} />{err(errors.title?.message)}</label>
      <label className="block text-sm font-medium">Civic problem<textarea rows={3} className={field} {...register("narrative")} />{err(errors.narrative?.message)}</label>
      <label className="block text-sm font-medium">Measurable outcome (KPI)<input className={field} {...register("outcome_kpi")} />{err(errors.outcome_kpi?.message)}</label>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium">Pilot budget (₹){budget > 0 && <span className="ml-2 text-slate-500">{inr(budget)}</span>}
          <input type="number" className={field} {...register("budget_cap")} />{err(errors.budget_cap?.message)}</label>
        <label className="block text-sm font-medium">Duration (weeks)<input type="number" className={field} {...register("max_weeks")} />{err(errors.max_weeks?.message)}</label>
        <label className="block text-sm font-medium">Minimum TRL (1-9)<input type="number" className={field} {...register("min_trl")} />{err(errors.min_trl?.message)}</label>
      </div>
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1" {...register("gemChecked")} /><span>I searched GeM and found no equivalent listed solution (GFR Rule 149).</span></label>
      {err(errors.gemChecked?.message)}
      <button disabled={!isDirty || !isValid || isSubmitting} className="rounded bg-gov px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300">Publish challenge</button>
    </form>
  );
}
