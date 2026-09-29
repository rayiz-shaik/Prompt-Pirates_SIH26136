import { PortalShell } from "@/components/layout/PortalShell";
import { StartupBadge } from "@/components/startup/StartupBadge";
const ITEMS = [{ href: "/startup/dashboard", label: "Dashboard" }, { href: "/startup/challenges", label: "Challenges" }, { href: "/startup/my-pilots", label: "My pilots" }];
export default function StartupLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell title="Startup" items={ITEMS} badge={<StartupBadge />}>{children}</PortalShell>;
}
