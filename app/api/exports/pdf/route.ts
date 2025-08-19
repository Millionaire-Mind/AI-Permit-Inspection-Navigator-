import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReportPDF } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";
import { ExportPDFSchema } from "@/types/api/export";

export async function POST(req: Request) {
  const data = await req.json();
  const parsed = ExportPDFSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const report = await prisma.report.findUnique({
    where: { id: parsed.data.reportId },
    include: { moderations: true, appeals: { include: { notes: true } } }
  });
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  const buf = await renderToBuffer(ReportPDF({ report, timezone: parsed.data.timezone ?? "America/Los_Angeles", noteTagFilter: parsed.data.noteTagFilter ?? null }));

  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="report-${report.id}.pdf"`
    }
  });
}
