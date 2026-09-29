import type { Role } from "@/types";
export const HOME_BY_ROLE: Record<Role, string> = {
  DEPARTMENT_OFFICER: "/officer/dashboard", TECHNICAL_EVALUATOR: "/officer/challenges",
  STARTUP: "/startup/dashboard", VIGILANCE_AUDITOR: "/auditor/trail",
};
export const DEMO_PASSWORD = "Demo@2026";
export const DEMO_PERSONAS = [
  { label: "Department Officer", identifier: "ee.pmc@punecorporation.gov.in" },
  { label: "Startup", identifier: "ABCDE1234F" },
  { label: "Technical Evaluator", identifier: "eval01@msins.gov.in" },
  { label: "Vigilance Auditor", identifier: "cvo@maharashtra.gov.in" },
];
