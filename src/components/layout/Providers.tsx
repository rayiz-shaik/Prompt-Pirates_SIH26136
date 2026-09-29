"use client";
import { useEffect, type ReactNode } from "react";
import { SessionProvider, useSession as useAuth } from "next-auth/react";
import { useSession } from "@/store/useSession";
import type { DbSnapshot } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";

interface ApiReply { snapshot: DbSnapshot; chainValid: boolean }

/** Loads the saved database after sign-in and writes every later change back (debounced). */
function StoreSync({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const hydrated = useSession((s) => s.hydrated);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") { useSession.setState({ hydrated: true }); return; }
    let applying = false, alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const apply = (d: ApiReply) => { applying = true; useSession.setState({ ...d.snapshot, chainValid: d.chainValid, hydrated: true }); applying = false; };

    fetch("/api/db", { cache: "no-store" }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: ApiReply) => alive && apply(d)).catch(() => useSession.setState({ hydrated: true }));

    const unsub = useSession.subscribe((s, prev) => {
      const same = s.milestones === prev.milestones && s.challenges === prev.challenges && s.logs === prev.logs && s.proposals === prev.proposals && s.scores === prev.scores;
      if (applying || !s.hydrated || same) return;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const { milestones, challenges, logs, proposals, scores } = useSession.getState();
        fetch("/api/db", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ milestones, challenges, logs, proposals, scores }) })
          .then((r) => (r.ok ? r.json() : null)).then((d: ApiReply | null) => d && apply(d)).catch(() => undefined);
      }, 300);
    });
    return () => { alive = false; unsub(); clearTimeout(timer); };
  }, [status]);

  if (!hydrated) return <div role="status" aria-label="Loading" className="space-y-4 p-6"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-40" /></div>;
  return <>{children}</>;
}

export const Providers = ({ children }: { children: ReactNode }) => <SessionProvider><StoreSync>{children}</StoreSync></SessionProvider>;
