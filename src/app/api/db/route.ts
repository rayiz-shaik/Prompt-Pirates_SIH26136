import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppendOnlyError, isSnapshot, readDb, saveSnapshot, verifyChain } from "@/lib/server-db";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await getServerSession(authOptions))) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const snapshot = await readDb();
  return NextResponse.json({ snapshot, chainValid: verifyChain(snapshot.logs) });
}

export async function PUT(req: Request) {
  if (!(await getServerSession(authOptions))) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const payload: unknown = await req.json();
  if (!isSnapshot(payload)) return NextResponse.json({ error: "Malformed snapshot" }, { status: 400 });
  try {
    const snapshot = await saveSnapshot(payload);
    return NextResponse.json({ snapshot, chainValid: verifyChain(snapshot.logs) });
  } catch (e) {
    if (e instanceof AppendOnlyError) return NextResponse.json({ error: e.message }, { status: 409 });
    throw e;
  }
}
