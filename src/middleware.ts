import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { HOME_BY_ROLE } from "@/lib/routes";

// Zone guard: a signed-in user is bounced to their own home rather than seeing another role's console.
export default withAuth(
  (req) => {
    const role = req.nextauth.token?.role;
    const path = req.nextUrl.pathname;
    const allowed = path.startsWith("/officer") ? ["DEPARTMENT_OFFICER", "TECHNICAL_EVALUATOR"] : path.startsWith("/startup") ? ["STARTUP"] : ["VIGILANCE_AUDITOR"];
    if (!role || !allowed.includes(role)) return NextResponse.redirect(new URL(role ? HOME_BY_ROLE[role] : "/login", req.url));
  },
  { callbacks: { authorized: ({ token }) => !!token } },
);
export const config = { matcher: ["/officer/:path*", "/startup/:path*", "/auditor/:path*"] };
