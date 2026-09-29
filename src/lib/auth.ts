import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Role } from "@/types";
import { DEMO_PASSWORD } from "@/lib/routes";

interface Account { id: string; logins: string[]; name: string; email: string; role: Role }
// Demo directory only. Production must verify identity through Aadhaar eKYC / DigiLocker, never a password table.
const ACCOUNTS: Account[] = [
  { id: "u1", logins: ["ee.pmc@punecorporation.gov.in", "123412341234"], name: "Er. Sunil Kulkarni", email: "ee.pmc@punecorporation.gov.in", role: "DEPARTMENT_OFFICER" },
  { id: "u2", logins: ["founder@ravemusarelo.in", "abcde1234f"], name: "Ravemusarelo Solutions Pvt Ltd", email: "founder@ravemusarelo.in", role: "STARTUP" },
  { id: "u3", logins: ["eval01@msins.gov.in"], name: "Dr. A. Deshpande", email: "eval01@msins.gov.in", role: "TECHNICAL_EVALUATOR" },
  { id: "u4", logins: ["cvo@maharashtra.gov.in"], name: "Shri R. Patil, CVO", email: "cvo@maharashtra.gov.in", role: "VIGILANCE_AUDITOR" },
];

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 },
  pages: { signIn: "/login" },
  providers: [CredentialsProvider({
    name: "Credentials",
    credentials: { identifier: { label: "Identifier", type: "text" }, password: { label: "Password", type: "password" } },
    async authorize(c) {
      const id = c?.identifier?.trim().toLowerCase();
      const acct = ACCOUNTS.find((a) => id && a.logins.includes(id));
      if (!acct || c?.password !== DEMO_PASSWORD) return null;
      return { id: acct.id, name: acct.name, email: acct.email, role: acct.role };
    },
  })],
  callbacks: {
    jwt: async ({ token, user }) => { if (user) token.role = user.role; return token; },
    session: async ({ session, token }) => {
      session.user.id = token.sub ?? "";
      session.user.role = token.role as Role;
      return session;
    },
  },
};
