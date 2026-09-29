import type { AuditLog, BlindProposal, Challenge, Department, PilotMilestone, Pilot, Proposal, StartupProfile, User } from "@/types";

export { PILOT_CAP } from "@/lib/rules";

export const users: User[] = [
  { id: "u1", name: "Er. Sunil Kulkarni", email: "ee.pmc@punecorporation.gov.in", role: "DEPARTMENT_OFFICER" },
  { id: "u2", name: "Founder, Ravemusarelo", email: "founder@ravemusarelo.in", role: "STARTUP" },
  { id: "u3", name: "Dr. A. Deshpande", email: "eval01@msins.gov.in", role: "TECHNICAL_EVALUATOR" },
  { id: "u4", name: "Shri R. Patil, CVO", email: "cvo@maharashtra.gov.in", role: "VIGILANCE_AUDITOR" },
];
export const startupProfiles: StartupProfile[] = [
  { id: "s1", user_id: "u2", company_name: "Ravemusarelo Solutions Pvt Ltd", dpiit_number: "DIPP98211", turnover: 1_200_000, is_turnover_exempted: true, is_emd_exempted: true, trl_level: 6 },
  { id: "s2", user_id: "u9", company_name: "AquaSense Labs LLP", dpiit_number: "DIPP77410", turnover: 800_000, is_turnover_exempted: true, is_emd_exempted: true, trl_level: 5 },
];
export const departments: Department[] = [
  { id: "d1", department_name: "Pune Municipal Corporation - Roads", jurisdiction: "Pune", nodal_officer_id: "u1", budget_head: "4215-Capital Outlay on Urban Dev." },
  { id: "d2", department_name: "Thane Municipal Corporation - Water Supply", jurisdiction: "Thane", nodal_officer_id: "u1", budget_head: "2217-Urban Development" },
];
export const challenges: Challenge[] = [
  { id: "c1", dept_id: "d2", title: "Thane Lake Water Anomaly Detection", narrative: "Detect contamination events in the distribution network before consumer impact.", outcome_kpi: "Detect at least 90% of turbidity/chlorine anomalies within 30 minutes", budget_cap: 1_200_000, max_weeks: 12, min_trl: 5, status: "PUBLISHED" },
  { id: "c2", dept_id: "d1", title: "Pune Pothole Drone Mapping", narrative: "Map carriageway defects across 3 wards to prioritise repairs.", outcome_kpi: "Geo-tagged defect map with at least 85% precision on 200 km of road", budget_cap: 1_500_000, max_weeks: 10, min_trl: 6, status: "PUBLISHED" },
];
export const proposals: Proposal[] = [
  { id: "MH-2026-A", challenge_id: "c1", startup_id: "s2", methodology: "Edge turbidity sensors with a drift-correcting model; 6 pilot nodes at ESR outlets.", cost: 1_150_000, score: null, is_shortlisted: false },
  { id: "MH-2026-B", challenge_id: "c1", startup_id: "s1", methodology: "Satellite and SCADA data fusion with anomaly scoring; no new hardware.", cost: 980_000, score: null, is_shortlisted: false },
];
export const pilots: Pilot[] = [{ id: "p1", challenge_id: "c2", startup_id: "s1", work_order_no: "PMC/ROADS/INN/2026/041", grant_amount: 1_500_000, stage: "PILOT" }];
export const pilotMilestones: PilotMilestone[] = [
  { id: "m1", pilot_id: "p1", index: 1, title: "Ward 12 flight and baseline capture", kpi_target: "50 km mapped, precision ≥85%", amount: 500_000, status: "PAID", evidence_url: "logs/ward12.zip", officer_notes: "Field-verified 5 km sample; 88% precision.", verified_at: "2026-08-14T10:20:00+05:30" },
  { id: "m2", pilot_id: "p1", index: 2, title: "Wards 13-14 mapping", kpi_target: "100 km mapped, precision ≥85%", amount: 600_000, status: "SUBMITTED", evidence_url: "logs/ward13-14.zip", officer_notes: null, verified_at: null },
  { id: "m3", pilot_id: "p1", index: 3, title: "Final report and handover", kpi_target: "200 km total; open-format GIS export", amount: 400_000, status: "PENDING", evidence_url: null, officer_notes: null, verified_at: null },
];
export const auditLogs: AuditLog[] = [
  { id: "a1", entity_name: "startup_profiles", entity_id: "s1", action: "DPIIT exemption badge issued (turnover and EMD)", performed_by: "SYSTEM/MSInS", legal_basis: "GFR 2017 Rule 173(i) and 170(i); Maharashtra Startup Policy 2018", timestamp: "2026-07-02T09:00:00+05:30" },
  { id: "a2", entity_name: "pilots", entity_id: "p1", action: "Work order issued for ₹15,00,000 pilot", performed_by: "u1", legal_basis: "MSInS pilot work-order limit (Maharashtra Startup Policy 2018)", timestamp: "2026-08-01T11:45:00+05:30" },
  { id: "a3", entity_name: "pilot_milestones", entity_id: "m1", action: "Milestone 1 verified; ₹5,00,000 released", performed_by: "u1", legal_basis: "Contract milestone-payment clause", timestamp: "2026-08-14T10:20:00+05:30" },
];

// SQL-like query helpers; a real deployment swaps these for a DB layer without touching components.
export const findStartupByUser = (uid: string) => startupProfiles.find((s) => s.user_id === uid);
export const getDepartmentName = (id: string) => departments.find((d) => d.id === id)?.department_name ?? "Unknown";

/**
 * Blind-screening projection. Fields are whitelisted explicitly so a future schema change
 * (e.g. adding founder_name) can never leak into evaluator views (CVC transparency guidelines).
 */
export function toBlindProposals(ps: Proposal[], cs: Challenge[]): BlindProposal[] {
  return ps.map((p) => ({
    alias: `Proposal #${p.id}`, proposalId: p.id, methodology: p.methodology, cost: p.cost,
    challengeTitle: cs.find((c) => c.id === p.challenge_id)?.title ?? "",
  }));
}
