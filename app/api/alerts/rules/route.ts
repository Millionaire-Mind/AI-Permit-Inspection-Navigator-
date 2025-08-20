export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;
import { NextResponse } from "next/server";

export async function GET() {
  const { prisma } = await import("@/lib/prisma");
  const rules = await prisma.alertRule.findMany({ where: { active: true }});
  return NextResponse.json({ rules });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { prisma } = await import("@/lib/prisma");
  const rule = await prisma.alertRule.create({
    data: {
      scope: body.scope ?? "global",
      scopeRef: body.scopeRef ?? null,
      kind: body.kind ?? "forecast_spike",
      threshold: body.threshold ?? 0.2,
      windowHours: body.windowHours ?? 24
    }
  });
  return NextResponse.json({ rule }, { status: 201 });
}
