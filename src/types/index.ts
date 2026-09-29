export type Role = "DEPARTMENT_OFFICER" | "STARTUP" | "TECHNICAL_EVALUATOR" | "VIGILANCE_AUDITOR";
export type MilestoneStatus = "PENDING" | "SUBMITTED" | "VERIFIED" | "PAID";
export type ChallengeStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
export type PilotStage = "PILOT" | "SCALE_UP";

export interface User { id: string; name: string; email: string; role: Role }
export interface StartupProfile {
  id: string; user_id: string; company_name: string; dpiit_number: string;
  turnover: number; is_turnover_exempted: boolean; is_emd_exempted: boolean; trl_level: number;
}
export interface Department { id: string; department_name: string; jurisdiction: string; nodal_officer_id: string; budget_head: string }
export interface Challenge {
  id: string; dept_id: string; title: string; narrative: string; outcome_kpi: string;
  budget_cap: number; max_weeks: number; min_trl: number; status: ChallengeStatus;
}
export interface Proposal {
  id: string; challenge_id: string; startup_id: string; methodology: string; cost: number;
  score: number | null; is_shortlisted: boolean;
}
export interface Pilot { id: string; challenge_id: string; startup_id: string; work_order_no: string; grant_amount: number; stage: PilotStage }
export interface PilotMilestone {
  id: string; pilot_id: string; index: number; title: string; kpi_target: string; amount: number;
  status: MilestoneStatus; evidence_url: string | null; officer_notes: string | null; verified_at: string | null;
}
export interface AuditLog {
  id: string; entity_name: string; entity_id: string; action: string;
  performed_by: string; legal_basis: string; timestamp: string; hash?: string;
  /** Hash-chain fields, assigned by the server only. */
  prev_hash?: string; chain_hash?: string;
}
/** Evaluator-safe projection: contains no field that can identify the bidder. */
export interface BlindProposal { alias: string; proposalId: string; challengeTitle: string; methodology: string; cost: number }
export interface RubricScores { feasibility: number; methodology: number; costEffectiveness: number; trlAlignment: number }

/** Everything that must survive a refresh; persisted server-side in data/db.json. */
export interface DbSnapshot {
  milestones: PilotMilestone[]; challenges: Challenge[]; logs: AuditLog[];
  proposals: Proposal[]; scores: Record<string, RubricScores>;
}
