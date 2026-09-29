"use client";
import { useSession } from "@/store/useSession";

export function AuditTable() {
  const { logs, chainValid } = useSession();
  const banner = chainValid === true ? ["bg-emerald-50 text-emerald-800", "Chain integrity verified by the server: every entry links to the one before it."]
    : chainValid === false ? ["bg-red-50 text-red-800", "Chain broken: the stored audit trail has been altered."]
    : ["bg-slate-100 text-slate-700", "Integrity not yet verified."];
  const short = (h?: string) => (h ? h.slice(0, 12) + "…" : "-");
  return (
    <section className="overflow-x-auto rounded border border-slate-200 bg-white">
      <div className="p-4"><h2 className="text-lg font-semibold">Compliance audit trail (read-only)</h2><p role="status" className={`mt-2 rounded px-3 py-2 text-sm ${banner[0]}`}>{banner[1]}</p></div>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100"><tr>{["Timestamp", "Actor", "Action", "Legal basis", "Action hash", "Chain hash"].map((h) => <th key={h} scope="col" className="px-4 py-2 font-semibold">{h}</th>)}</tr></thead>
        <tbody className="divide-y">
          {logs.map((l) => (
            <tr key={l.id}>
              <td className="whitespace-nowrap px-4 py-2">{new Date(l.timestamp).toLocaleString("en-IN")}</td>
              <td className="px-4 py-2">{l.performed_by}</td><td className="px-4 py-2">{l.action}</td><td className="px-4 py-2">{l.legal_basis}</td>
              <td className="px-4 py-2 font-mono text-xs">{short(l.hash)}</td><td className="px-4 py-2 font-mono text-xs">{short(l.chain_hash)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
