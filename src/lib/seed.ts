import type { DbSnapshot } from "@/types";
import { auditLogs, challenges, pilotMilestones, proposals } from "@/lib/mock-data";

/** Initial dataset used for the first run and by "reset demo data". */
export const seedSnapshot = (): DbSnapshot => ({
  milestones: pilotMilestones.map((m) => ({ ...m })), challenges: challenges.map((c) => ({ ...c })),
  logs: auditLogs.map((l) => ({ ...l })), proposals: proposals.map((p) => ({ ...p })), scores: {},
});
