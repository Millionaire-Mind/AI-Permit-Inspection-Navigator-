import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AppealCreateSchema } from "@/types/api/appeal";

export async function GET() {
  const appeals = await prisma.appeal.findMany({ orderBy: { createdAt:"desc" }});
  return NextResponse.json({ appeals });
}

export async function POST(req: Request) {
  const data = await req.json();
  const parsed = AppealCreateSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const appeal = await prisma.appeal.create({
    data: {
      userId: parsed.data.userId,
      reportId: parsed.data.reportId,
      reason: parsed.data.reason
    }
  });
  return NextResponse.json({ appeal }, { status: 201 });
}
