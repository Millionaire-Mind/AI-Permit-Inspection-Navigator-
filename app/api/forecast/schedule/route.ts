import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Forecast schedule API is not implemented in Phase 1" }, { status: 501 });
}
