import Link from "next/link";
import { Building2, FlaskConical, Rocket, Scale, Search, ShieldCheck, Stamp } from "lucide-react";
import { PILOT_CAP, RULE_TABLE, type RuleStatus } from "@/lib/rules";
import { inr } from "@/lib/format";

const STEPS = [
  { icon: Search, title: "Identify", text: "A department describes a civic problem and the measurable result it wants, never a product." },
  { icon: FlaskConical, title: "Pilot", text: `DPIIT startups bid blind. The best gets a work order of up to ${inr(PILOT_CAP)} to prove it works.` },
  { icon: Stamp, title: "Procure", text: "Money is released in instalments, only after the officer inspects the evidence and records remarks." },
  { icon: Rocket, title: "Scale", text: "A verified pilot becomes the documented basis for a larger, lawful purchase." },
];
const AUDIENCE = [
  { icon: Building2, title: "Departments", text: "Float outcome-based challenges in minutes, with the legal checks built into the form." },
  { icon: FlaskConical, title: "Startups", text: "No turnover barrier, no earnest money. Bid, deliver and get paid per milestone." },
  { icon: ShieldCheck, title: "Vigilance and audit", text: "Every action is logged in a tamper-evident chain, with a one-click defense dossier." },
];
const TAG: Record<RuleStatus, string> = { STATUTORY: "bg-emerald-100 text-emerald-800", PROGRAMME_LIMIT: "bg-amber-100 text-amber-800", DESIGN_PARAMETER: "bg-slate-200 text-slate-700" };
const TAG_TEXT: Record<RuleStatus, string> = { STATUTORY: "GFR rule", PROGRAMME_LIMIT: "MSInS programme limit", DESIGN_PARAMETER: "Portal setting" };

export default function Landing() {
  return (
    <div>
      <header className="bg-gov text-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div><p className="font-semibold">Pilot-driven Regulatory Outcome & Milestone Procurement Tracker (PROMPT)</p><p className="text-xs text-slate-300">Maharashtra State Innovation Society (MSInS)</p></div>
        <nav className="flex gap-3 text-sm"><Link href="/login" className="rounded px-3 py-1.5 hover:bg-white/10">Sign in</Link><Link href="/register" className="rounded bg-white px-3 py-1.5 font-medium text-gov">Register</Link></nav></div></header>

      <section className="border-b bg-white"><div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-5">
        <div className="space-y-5 md:col-span-3">
          <p className="text-sm font-medium text-gov">Smart India Hackathon 2026 | SIH26136</p>
          <h1 className="text-4xl font-bold leading-tight">Startup-friendly public procurement: try it first, buy it once it works.</h1>
          <p className="max-w-xl text-lg text-slate-700">Government tenders ask for years of turnover and past contracts, which no young startup has. This portal lets departments pilot a startup's solution first, verify the result, and only then procure it.</p>
          <div className="flex flex-wrap gap-3"><Link href="/login" className="rounded bg-gov px-5 py-2.5 text-white">Try the live demo</Link><Link href="#how" className="rounded border border-gov px-5 py-2.5 text-gov">How it works</Link></div>
        </div>
        <aside className="space-y-3 rounded border bg-slate-50 p-5 md:col-span-2" aria-label="The tender paradox">
          <p className="font-semibold">The tender paradox</p>
          <p className="text-sm text-slate-700">"Show us three years of government contracts" is impossible for a startup that has never had a government customer.</p>
          <p className="text-sm text-slate-700">The result: departments miss local innovation, and startups never get the first order that would prove their product.</p>
          <p className="rounded bg-emerald-50 p-3 text-sm text-emerald-900">Our fix: a small, time-boxed, fully audited pilot that turns a promise into evidence.</p>
        </aside></div></section>

      <section className="border-b bg-gov text-white"><dl className="mx-auto grid max-w-6xl gap-4 px-4 py-6 sm:grid-cols-3">
        {[[inr(PILOT_CAP), "maximum pilot work order"], ["Zero", "turnover or EMD barriers for DPIIT startups"], ["SHA-256", "hash-chained audit trail"]].map(([n, l]) => <div key={l}><dt className="text-2xl font-bold">{n}</dt><dd className="text-sm text-slate-300">{l}</dd></div>)}
      </dl></section>

      <section id="how" className="mx-auto max-w-6xl px-4 py-14"><h2 className="text-2xl font-bold">How a pilot works</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-4">{STEPS.map((s, i) => <li key={s.title} className="rounded border bg-white p-5"><s.icon className="text-gov" size={24} aria-hidden /><p className="mt-3 font-semibold">{i + 1}. {s.title}</p><p className="mt-1 text-sm text-slate-700">{s.text}</p></li>)}</ol></section>

      <section className="bg-white"><div className="mx-auto max-w-6xl px-4 py-14"><h2 className="text-2xl font-bold">Built for three kinds of users</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">{AUDIENCE.map((a) => <div key={a.title} className="rounded border p-5"><a.icon className="text-gov" size={24} aria-hidden /><p className="mt-3 font-semibold">{a.title}</p><p className="mt-1 text-sm text-slate-700">{a.text}</p></div>)}</div></div></section>

      <section className="mx-auto max-w-6xl px-4 py-14"><div className="flex items-center gap-2"><Scale className="text-gov" aria-hidden /><h2 className="text-2xl font-bold">Rules the portal enforces</h2></div>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">Each rule is labelled honestly: a central GFR provision, an MSInS programme limit, or a setting of this portal. Sources were checked in September 2026; confirm before live use.</p>
        <ul className="mt-6 divide-y rounded border bg-white">{RULE_TABLE.map((r) => <li key={r.id} className="flex flex-wrap items-start justify-between gap-2 p-4"><div><p className="font-medium">{r.title}</p><p className="text-sm text-slate-600">{r.effect}</p><p className="text-xs text-slate-500">{r.citation}</p></div><span className={`rounded px-2 py-0.5 text-xs font-medium ${TAG[r.status]}`}>{TAG_TEXT[r.status]}</span></li>)}</ul></section>

      <footer className="bg-gov text-slate-300"><div className="mx-auto max-w-6xl px-4 py-6 text-sm">Prototype for SIH 2026, Problem Statement SIH26136. Demo data only; no real payments are made.</div></footer>
    </div>
  );
}
