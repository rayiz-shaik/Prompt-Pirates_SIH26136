import type { MilestoneStatus } from "@/types";
const STYLES: Record<MilestoneStatus, string> = {
  PENDING: "bg-slate-100 text-slate-700", SUBMITTED: "bg-amber-100 text-amber-800",
  VERIFIED: "bg-sky-100 text-sky-800", PAID: "bg-emerald-100 text-emerald-800",
};
const LABEL: Record<MilestoneStatus, string> = { PENDING: "Not started", SUBMITTED: "Pending verification", VERIFIED: "Verified", PAID: "Disbursed" };
export const StatusBadge = ({ status }: { status: MilestoneStatus }) => (
  <span className={`rounded px-2 py-0.5 text-xs font-medium ${STYLES[status]}`}>{LABEL[status]}</span>
);
