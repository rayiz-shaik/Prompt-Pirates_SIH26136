import { PortalShell } from "@/components/layout/PortalShell";
const ITEMS = [{ href: "/officer/dashboard", label: "Dashboard" }, { href: "/officer/challenges", label: "Challenges" }, { href: "/officer/pilots", label: "Pilots" }];
export default function OfficerLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell title="Department Officer" items={ITEMS}>{children}</PortalShell>;
}
