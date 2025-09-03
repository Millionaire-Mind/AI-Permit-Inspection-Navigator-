import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Appeals API is not implemented in Phase 1" }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ error: "Appeals API is not implemented in Phase 1" }, { status: 501 });
}
