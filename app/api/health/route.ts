import { NextResponse } from "next/server";

export async function GET() {
  const started = (globalThis as any).__app_started || Date.now();
  (globalThis as any).__app_started = started;
  const uptimeMs = Date.now() - started;
  return NextResponse.json({ status: "ok", time: new Date().toISOString(), uptimeMs });
}

