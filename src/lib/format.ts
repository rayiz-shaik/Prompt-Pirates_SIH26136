/** Indian digit grouping (₹15,00,000) as required for all public-facing financial displays. */
export const inr = (n: number): string => "₹" + new Intl.NumberFormat("en-IN").format(n);

/** SHA-256 hex digest via Web Crypto; makes officer sign-offs tamper-evident in the audit trail. */
export async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
