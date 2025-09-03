import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "SLA settings API is not implemented in Phase 1" }, { status: 501 });
}

export async function PUT() {
  return NextResponse.json({ error: "SLA settings API is not implemented in Phase 1" }, { status: 501 });
}
