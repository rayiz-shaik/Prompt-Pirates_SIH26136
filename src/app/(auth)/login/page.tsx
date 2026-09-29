"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { DEMO_PASSWORD, DEMO_PERSONAS, HOME_BY_ROLE } from "@/lib/routes";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError(null);
    const res = await signIn("credentials", { identifier, password, redirect: false });
    if (!res?.ok) { setError("Identifier or password is incorrect."); setBusy(false); return; }
    // Full navigation (not router.push) so the fresh session cookie reaches the middleware on the first request.
    // The fallback guards against an undefined role, which would push to a non-existent path and 404.
    const s = await getSession();
    window.location.assign((s && HOME_BY_ROLE[s.user.role]) || "/login");
  }
  const box = "mt-1 w-full rounded border border-slate-300 px-3 py-2";
  return (
    <main className="mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4 rounded border bg-white p-5">
        <label className="block text-sm font-medium">Email, Aadhaar number or PAN<input className={box} value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" /></label>
        <label className="block text-sm font-medium">Password
          <div className="relative mt-1">
            <input type={show ? "text" : "password"} className="w-full rounded border border-slate-300 px-3 py-2 pr-10" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} className="absolute inset-y-0 right-2 flex items-center text-slate-500 hover:text-slate-900">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div></label>
        {error && <p role="alert" className="text-red-700">{error}</p>}
        <button disabled={!identifier || !password || busy} className="rounded bg-gov px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-300">Sign in</button>
      </form>
      <section className="rounded border bg-white p-4 text-sm"><p className="font-medium">Demo accounts (password {DEMO_PASSWORD})</p>
        <div className="mt-2 flex flex-wrap gap-2">{DEMO_PERSONAS.map((d) => <button key={d.label} type="button" className="rounded border px-3 py-1" onClick={() => { setIdentifier(d.identifier); setPassword(DEMO_PASSWORD); }}>{d.label}</button>)}</div></section>
      <p className="text-sm">New here? <Link href="/register" className="underline">Register</Link></p>
    </main>
  );
}
