"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession as useAuth } from "next-auth/react";
import type { ReactNode } from "react";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export interface NavItem { href: string; label: string }
interface Props { title: string; items: NavItem[]; badge?: ReactNode; children: ReactNode }

export function PortalShell({ title, items, badge, children }: Props) {
  const path = usePathname();
  const { data } = useAuth();
  return (
    <div className="min-h-screen md:flex">
      <aside className="space-y-4 bg-gov p-4 text-white md:w-60 md:shrink-0">
        <p className="font-semibold">{title}</p>
        {badge}
        <nav aria-label={`${title} navigation`} className="flex flex-wrap gap-1 md:flex-col">
          {items.map((i) => {
            const on = path.startsWith(i.href);
            return <Link key={i.href} href={i.href} aria-current={on ? "page" : undefined} className={`rounded px-3 py-2 ${on ? "bg-white font-semibold text-gov" : "hover:bg-white/10"}`}>{i.label}</Link>;
          })}
        </nav>
        <div className="text-sm text-slate-300">{data?.user.name}
          <button onClick={() => signOut({ callbackUrl: "/" })} className="mt-1 block underline">Sign out</button></div>
      </aside>
      <main className="flex-1 space-y-4 p-6">
        <p className="text-sm text-slate-500">{path.split("/").filter(Boolean).join(" / ")}</p>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}
