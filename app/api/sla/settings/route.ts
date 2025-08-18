import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.sLASettings.findMany();
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { category, threshold, teamId, graceMin } = body;
  const saved = await prisma.sLASettings.upsert({
    where: { id: `${category}-${teamId ?? "global"}` }, // synthetic unique? if needed, swap to @@unique in schema
    create: { category, threshold, teamId, graceMin: graceMin ?? 15, id: `${category}-${teamId ?? "global"}` },
    update: { threshold, graceMin }
  });
  return NextResponse.json({ saved });
}
