import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReportPDF } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";
import { ExportPDFSchema } from "@/types/api/export";

export async function POST(req: Request) {
  const data = await req.json();
  const parsed = ExportPDFSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const report = await prisma.report.findUnique({ where: { id: parsed.data.reportId } });
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  const buf = await renderToBuffer(
    ReportPDF({
      title: `Report ${report.id}`,
      status: report.status,
      projectName: report.address ?? "—",
      createdAt: report.createdAt.toISOString(),
    })
  );

  // Persist PdfExport record (store a placeholder URL since we're streaming)
  await prisma.pdfExport.create({
    data: {
      reportId: report.id,
      userId: report.userId,
      fileUrl: `/api/exports/pdf?reportId=${report.id}`,
    },
  });

  return new NextResponse(buf as any, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="report-${report.id}.pdf"`
    }
  });
}