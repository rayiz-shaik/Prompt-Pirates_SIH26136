import { createHash } from "crypto";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import type { AuditLog, DbSnapshot } from "@/types";
import { seedSnapshot } from "@/lib/seed";

const DIR = path.join(process.cwd(), "data");
const FILE = path.join(DIR, "db.json");
export class AppendOnlyError extends Error {}

const digest = (s: string) => createHash("sha256").update(s).digest("hex");
const body = (l: AuditLog) => JSON.stringify([l.id, l.entity_name, l.entity_id, l.action, l.performed_by, l.legal_basis, l.timestamp, l.hash ?? ""]);

/** Each entry commits to the one before it, so editing or deleting history breaks every later hash. Logs are held newest-first. */
export function chainLogs(newestFirst: AuditLog[]): AuditLog[] {
  let prev = "GENESIS";
  return [...newestFirst].reverse().map((l) => {
    const chain_hash = digest(prev + body(l));
    const linked = { ...l, prev_hash: prev, chain_hash };
    prev = chain_hash;
    return linked;
  }).reverse();
}
export function verifyChain(newestFirst: AuditLog[]): boolean {
  let prev = "GENESIS";
  for (const l of [...newestFirst].reverse()) {
    if (l.prev_hash !== prev || l.chain_hash !== digest(prev + body(l))) return false;
    prev = l.chain_hash;
  }
  return true;
}

export async function readDb(): Promise<DbSnapshot> {
  try { return JSON.parse(await readFile(FILE, "utf8")) as DbSnapshot; }
  catch {
    const s = seedSnapshot();
    const seeded = { ...s, logs: chainLogs(s.logs) };
    await writeDb(seeded);
    return seeded;
  }
}
async function writeDb(s: DbSnapshot) {
  await mkdir(DIR, { recursive: true });
  await writeFile(FILE + ".tmp", JSON.stringify(s, null, 2));
  await rename(FILE + ".tmp", FILE); // atomic swap: a crash never leaves a half-written file
}

/** The server, not the browser, decides what history looks like: existing entries must arrive unchanged. */
export async function saveSnapshot(incoming: DbSnapshot): Promise<DbSnapshot> {
  const current = await readDb();
  const old = [...current.logs].reverse(), next = [...incoming.logs].reverse();
  if (next.length < old.length || old.some((l, i) => body(l) !== body(next[i]))) throw new AppendOnlyError("Audit log is append-only");
  const saved = { ...incoming, logs: chainLogs(incoming.logs) };
  await writeDb(saved);
  return saved;
}
export const isSnapshot = (x: unknown): x is DbSnapshot => {
  const o = x as Partial<DbSnapshot> | null;
  return !!o && [o.milestones, o.challenges, o.logs, o.proposals].every(Array.isArray) && typeof o.scores === "object" && o.scores !== null;
};
