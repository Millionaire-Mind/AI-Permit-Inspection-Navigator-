import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReportCreateSchema } from "@/types/api/report";
import { z } from "zod";

export async function GET() {
  const reports = await prisma.report.findMany({ orderBy: { createdAt: "desc" }});
  return NextResponse.json({ reports });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = ReportCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const { userId, address } = parsed.data;
  const report = await prisma.report.create({ data: { userId, address, status: "pending" } });
  return NextResponse.json({ report }, { status: 201 });
}
