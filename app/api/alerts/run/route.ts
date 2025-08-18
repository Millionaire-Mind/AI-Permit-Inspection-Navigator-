import { NextResponse } from "next/server";
import { runAlertSweep } from "@/lib/alerts";

export async function POST() {
  const result = await runAlertSweep();
  return NextResponse.json(result);
}
