export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;
import { NextResponse } from "next/server";
import { runAlertSweep } from "@/lib/alerts";

export async function POST() {
  const result = await runAlertSweep();
  return NextResponse.json(result);
}
