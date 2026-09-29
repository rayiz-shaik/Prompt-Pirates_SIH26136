"use client";
import { useEffect, useState } from "react";
import { useSession } from "@/store/useSession";
import { PILOT_CAP, pilots } from "@/lib/mock-data";
import { inr, sha256 } from "@/lib/format";
import { Modal } from "@/components/ui/Modal";

/** One-click evidence pack for CAG / vigilance queries: automated compliance checks plus a digest of the full trail. */
export function AuditDefenseDossier() {
  const { logs, milestones, chainValid } = useSession();
  const [open, setOpen] = useState(false);
  const [digest, setDigest] = useState("");
  const pilot = pilots[0];
  const paid = milestones.filter((m) => m.status === "PAID");
  const released = paid.reduce((a, m) => a + m.amount, 0);
  const checks = [
    { ok: pilot.grant_amount <= PILOT_CAP, text: `Grant ${inr(pilot.grant_amount)} is within the ${inr(PILOT_CAP)} ceiling (MSInS pilot limit)` },
    { ok: paid.every((m) => (m.officer_notes?.trim().length ?? 0) >= 20), text: "Every disbursed milestone carries recorded inspection remarks" },
    { ok: released <= pilot.grant_amount, text: `Released ${inr(released)} does not exceed the sanctioned grant` },
    { ok: chainValid === true, text: "Server-verified hash chain: no audit entry has been altered or removed" },
    { ok: logs.length > 0, text: `${logs.length} append-only log entries on record` },
  ];
  useEffect(() => { if (open) sha256(JSON.stringify(logs)).then(setDigest); }, [open, logs]);

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded bg-gov px-4 py-2 text-white">Generate audit defense dossier</button>
      {open && (
        <Modal title={`Audit defense dossier: ${pilot.work_order_no}`} onClose={() => setOpen(false)}>
          <ul className="space-y-2 text-sm">{checks.map((c) => (
            <li key={c.text} className={c.ok ? "text-emerald-800" : "text-red-700"}>{c.ok ? "Pass" : "Needs review"}: {c.text}</li>))}</ul>
          <p className="mt-4 break-all font-mono text-xs">Trail digest (SHA-256): {digest || "computing…"}</p>
          <button onClick={() => window.print()} className="mt-4 rounded border px-4 py-2">Print or save as PDF</button>
        </Modal>
      )}
    </>
  );
}
