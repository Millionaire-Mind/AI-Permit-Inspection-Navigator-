import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReportUpdateSchema } from "@/types/api/report";

export async function GET(_: Request, { params }: { params: { id: string }}) {
  const report = await prisma.report.findUnique({
    where: { id: params.id },
    include: {
      pdfExports: true,
      user: true,
    }
  });
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ report });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string }}) {
  const body = await req.json();
  const parsed = ReportUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  const updated = await prisma.report.update({ where: { id: params.id }, data: parsed.data });
  return NextResponse.json({ report: updated });
}
