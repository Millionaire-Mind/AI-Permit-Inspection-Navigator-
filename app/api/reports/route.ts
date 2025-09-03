import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReportCreateSchema } from "@/types/api/report";
import { z } from "zod";

export async function GET() {
  const client: any = prisma as any;
  const reports = client.report?.findMany ? await client.report.findMany({ orderBy: { createdAt: "desc" }}) : [];
  return NextResponse.json({ reports });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parse = ReportCreateSchema.safeParse(body);
  if (!parse.success) return NextResponse.json({ error: parse.error.format() }, { status: 400 });

  const { userId, address } = parse.data;
  const client: any = prisma as any;
  if (!client.report?.create) return NextResponse.json({ error: "Report model not available" }, { status: 501 });
  const report = await client.report.create({
    data: { userId, address, status: "pending" }
  });
  return NextResponse.json({ report }, { status: 201 });
}
