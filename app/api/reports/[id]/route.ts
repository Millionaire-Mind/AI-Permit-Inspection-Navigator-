import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string }}) {
  const report = await prisma.report.findUnique({
    where: { id: params.id },
    include: {
      moderations: true,
      appeals: { include: { notes: true } },
      pdfExports: true
    }
  });
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ report });
}
