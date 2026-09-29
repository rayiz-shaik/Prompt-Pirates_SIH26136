import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Forwards authenticated calls to the state procurement backend so hostnames and service credentials never reach the browser.
async function forward(req: NextRequest, { params }: { params: { path: string[] } }) {
  const token = await getToken({ req });
  if (!token) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const base = process.env.BACKEND_URL;
  if (!base) return NextResponse.json({ error: "BACKEND_URL is not set; the demo runs on in-memory data." }, { status: 503 });
  const hasBody = !["GET", "HEAD"].includes(req.method);
  const res = await fetch(`${base}/${params.path.join("/")}${req.nextUrl.search}`, {
    method: req.method, headers: { "Content-Type": "application/json", "X-Actor-Role": String(token.role) },
    body: hasBody ? await req.text() : undefined,
  });
  return new NextResponse(res.body, { status: res.status, headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" } });
}
export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
