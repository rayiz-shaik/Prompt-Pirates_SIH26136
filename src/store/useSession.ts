import { create } from "zustand";
import type { AuditLog, Challenge, DbSnapshot, PilotMilestone, Proposal, RubricScores } from "@/types";
import { seedSnapshot } from "@/lib/seed";

interface SessionState extends DbSnapshot {
  hydrated: boolean;
  chainValid: boolean | null;
  addLog: (l: Omit<AuditLog, "id" | "timestamp">) => void;
  updateMilestone: (id: string, patch: Partial<PilotMilestone>) => void;
  addChallenge: (c: Challenge) => void;
  addProposal: (p: Proposal) => void;
  lockScore: (proposalId: string, s: RubricScores) => void;
}
/** Working copy in the browser. <StoreSync/> loads it from, and saves it to, the server database. */
export const useSession = create<SessionState>((set) => ({
  ...seedSnapshot(), hydrated: false, chainValid: null,
  // Append-only: no update or delete action exists for logs. The server rejects any attempt to rewrite history.
  addLog: (l) => set((s) => ({ logs: [{ ...l, id: `a${s.logs.length + 1}`, timestamp: new Date().toISOString() }, ...s.logs] })),
  updateMilestone: (id, patch) => set((s) => ({ milestones: s.milestones.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
  addChallenge: (c) => set((s) => ({ challenges: [c, ...s.challenges] })),
  addProposal: (p) => set((s) => ({ proposals: [...s.proposals, p] })),
  lockScore: (id, sc) => set((s) => {
    const total = sc.feasibility + sc.methodology + sc.costEffectiveness + sc.trlAlignment;
    return { scores: { ...s.scores, [id]: sc }, proposals: s.proposals.map((p) => (p.id === id ? { ...p, score: total } : p)) };
  }),
}));
