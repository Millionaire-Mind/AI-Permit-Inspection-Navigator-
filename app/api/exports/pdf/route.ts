import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReportPDF } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";
import { ExportPDFSchema } from "@/types/api/export";
import { canUseFeature } from "@/lib/featureGate";
import { uploadBuffer, getSignedFileUrl } from "@/lib/storage";

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function POST(req: Request) {
  const data = await req.json();
  const parsed = ExportPDFSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const client: any = prisma as any;
  const allowed = await canUseFeature({ feature: "pdf_export", userEmail: undefined });
  if (!allowed) return NextResponse.json({ error: "feature_not_enabled" }, { status: 402 });
  const report = client.report?.findUnique ? await client.report.findUnique({
    where: { id: parsed.data.reportId },
    include: { moderations: true, appeals: { include: { notes: true } } }
  }) : null;
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  const buf = await renderToBuffer(ReportPDF({ report, timezone: parsed.data.timezone ?? "America/Los_Angeles", noteTagFilter: parsed.data.noteTagFilter ?? null } as any));

  let key = `exports/reports/${report.id}-${Date.now()}.pdf`;
  try {
    await uploadBuffer({ key, contentType: "application/pdf", body: Buffer.from(buf as any) });
    const signedUrl = await getSignedFileUrl({ key, expiresIn: 60 * 15 });
    if (client.pdfExport?.create) {
      await client.pdfExport.create({ data: { reportId: report.id, userId: report.userId ?? "system", fileUrl: key, signedUrl } });
    }
    return NextResponse.json({ ok: true, key, signedUrl });
  } catch (e) {
    console.error("Upload failed, falling back to direct response", e);
    return new NextResponse(buf as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="report-${report.id}.pdf"`
      }
    });
  }
}