"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const path = usePathname();
  return (
    <main className="mx-auto max-w-md space-y-3 p-8">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-slate-700">There is no page at <code className="rounded bg-slate-200 px-1">{path}</code>.</p>
      <p><Link href="/" className="underline">Home</Link> | <Link href="/login" className="underline">Sign in</Link></p>
    </main>
  );
}
