import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  return NextResponse.json({ window: { from, to }, totals: { appeals: 0, handled: 0, slaBreaches: 0 }, perCategory: [] });
}
