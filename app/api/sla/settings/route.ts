import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.sLASettings.findMany();
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { category, threshold, teamId, graceMin } = body;
  const client: any = prisma as any;
  const saved = client.sLASettings?.upsert ? await client.sLASettings.upsert({
    where: { id: `${category}-${teamId ?? "global"}` },
    create: { category, threshold, teamId, id: `${category}-${teamId ?? "global"}` },
    update: { threshold }
  }) : { id: `${category}-${teamId ?? "global"}`, category, threshold, teamId };
  return NextResponse.json({ saved });
}
