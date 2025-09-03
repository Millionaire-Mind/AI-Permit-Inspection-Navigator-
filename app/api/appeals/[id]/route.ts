import { NextResponse } from "next/server";

// Phase 2 feature: stubbed during Phase 1 to keep build green
export async function GET() {
  return NextResponse.json({ error: "Appeals API is not implemented in Phase 1" }, { status: 501 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Appeals API is not implemented in Phase 1" }, { status: 501 });
}
