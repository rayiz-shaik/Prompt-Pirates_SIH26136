import { PortalShell } from "@/components/layout/PortalShell";
export default function AuditorLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell title="Vigilance Auditor" items={[{ href: "/auditor/trail", label: "Audit trail" }]}>{children}</PortalShell>;
}
