/**
 * Single source of truth for every legal or policy limit the portal enforces.
 * Each entry records HOW SURE we are, so nobody mistakes a programme setting for a statute.
 * Last checked against public sources: 30 Sep 2026. Re-verify before any live deployment.
 */
export type RuleStatus = "STATUTORY" | "PROGRAMME_LIMIT" | "DESIGN_PARAMETER";
export interface RuleRef { id: string; title: string; citation: string; effect: string; status: RuleStatus }

/** MSInS pilot work orders are "up to ₹15 lakh" (Maharashtra State Innovative Startup Policy 2018; Startup Week 2018-24).
 *  Press reports say Startup Policy 2025 raises this to ₹25 lakh; confirm against the GR before changing. */
export const PILOT_CAP = 1_500_000;
export const PILOT_WEEKS = { min: 4, max: 26 };
/** DPIIT startup definition (DoE amendment to MfPCOS 2017): up to 10 years old, turnover never above ₹100 crore. */
export const STARTUP_MAX_TURNOVER = 1_000_000_000;

export const LEGAL = {
  PILOT: "MSInS pilot work-order limit (Maharashtra State Innovative Startup Policy 2018)",
  TURNOVER: "GFR 2017 Rule 173(i)",
  EMD: "GFR 2017 Rule 170(i); DoE OM 25-07-2017 and 12-11-2020",
  SPEC: "GFR 2017 Rule 144 (generic, functional specifications)",
  GEM: "GFR 2017 Rule 149 (GeM mandatory for listed items)",
  MILESTONE: "Contract milestone-payment clause",
  EVAL: "CVC transparency guidelines",
} as const;

export const RULE_TABLE: RuleRef[] = [
  { id: "r1", title: "Prior turnover and experience relaxed", citation: LEGAL.TURNOVER, effect: "DPIIT startups bid without turnover or track-record barriers, if quality and technical specs are met.", status: "STATUTORY" },
  { id: "r2", title: "No earnest money deposit", citation: LEGAL.EMD, effect: "Startups sign a Bid Security Declaration instead of paying EMD.", status: "STATUTORY" },
  { id: "r3", title: "Outcome, not brand", citation: LEGAL.SPEC, effect: "Challenges state measurable outcomes; brand or hardware prescriptions are blocked.", status: "STATUTORY" },
  { id: "r4", title: "GeM check before floating", citation: LEGAL.GEM, effect: "Officers confirm no equivalent item is listed on GeM.", status: "STATUTORY" },
  { id: "r5", title: "₹15,00,000 pilot ceiling", citation: LEGAL.PILOT, effect: "Pilot work orders cannot exceed the MSInS limit. Configurable in one file.", status: "PROGRAMME_LIMIT" },
  { id: "r6", title: "4 to 26 week pilots", citation: "Portal design parameter", effect: "Keeps pilots short enough to be a trial, not a disguised contract.", status: "DESIGN_PARAMETER" },
];
