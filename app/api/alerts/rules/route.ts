import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rules = await prisma.AlertRule.findMany({ where: { active: true }});
  return NextResponse.json({ rules });
}

export async function POST(req: Request) {
  const body = await req.json();
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
