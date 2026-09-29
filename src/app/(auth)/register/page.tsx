"use client";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// DPIIT certificate numbers are the eligibility key for GFR startup relaxations, so they are checked at onboarding.
const schema = z.object({
  orgType: z.enum(["STARTUP", "DEPARTMENT"]),
  orgName: z.string().min(3, "Enter the registered name"),
  registrationId: z.string().min(1, "Enter your registration ID"),
  email: z.string().email("Use an official email address"),
}).superRefine((v, ctx) => {
  const ok = v.orgType === "STARTUP" ? /^DIPP\d{4,6}$/.test(v.registrationId) : /^[A-Z]{2,5}-[A-Z]{2,5}-\d{2,4}$/.test(v.registrationId);
  if (!ok) ctx.addIssue({ code: "custom", path: ["registrationId"], message: v.orgType === "STARTUP" ? "DPIIT number looks like DIPP98211" : "Department code looks like PMC-ENG-041" });
});
type Values = z.infer<typeof schema>;

export default function RegisterPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<Values>({ resolver: zodResolver(schema), mode: "onChange", defaultValues: { orgType: "STARTUP" } });
  const box = "mt-1 w-full rounded border border-slate-300 px-3 py-2";
  if (sent) return <main className="mx-auto max-w-md p-6"><p className="rounded border bg-white p-5">Application received. MSInS will verify your registration and email you within 2 working days. <Link href="/login" className="underline">Back to sign in</Link></p></main>;
  return (
    <main className="mx-auto max-w-md space-y-4 p-6"><h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={handleSubmit(() => setSent(true))} className="space-y-4 rounded border bg-white p-5" noValidate>
        <label className="block text-sm font-medium">I am registering a<select className={box} {...register("orgType")}><option value="STARTUP">DPIIT-recognised startup</option><option value="DEPARTMENT">Government department</option></select></label>
        <label className="block text-sm font-medium">Registered name<input className={box} {...register("orgName")} />{errors.orgName && <span role="alert" className="text-red-700">{errors.orgName.message}</span>}</label>
        <label className="block text-sm font-medium">DPIIT number or department code<input className={box} {...register("registrationId")} />{errors.registrationId && <span role="alert" className="text-red-700">{errors.registrationId.message}</span>}</label>
        <label className="block text-sm font-medium">Official email<input className={box} {...register("email")} />{errors.email && <span role="alert" className="text-red-700">{errors.email.message}</span>}</label>
        <button disabled={!isValid} className="rounded bg-gov px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-slate-300">Submit for verification</button>
      </form></main>
  );
}
