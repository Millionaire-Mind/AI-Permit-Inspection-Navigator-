import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string }}) {
  const client: any = prisma as any;
  if (!client.report?.findUnique) return NextResponse.json({ error: "Report model not available" }, { status: 501 });
  const report = await client.report.findUnique({
    where: { id: params.id },
    include: {
      moderations: true,
      appeals: { include: { notes: true } },
      pdfExports: true
    }
  });
  if (!report) return NextResponse.json({ error: "Not found" }, { status: 404 });
  try {
    if (client.aIAssistLog?.findMany && Array.isArray(report.appeals) && report.appeals.length > 0) {
      const appealIds = report.appeals.map((a: any) => a.id);
      const logs = await client.aIAssistLog.findMany({
        where: { appealId: { in: appealIds } },
        select: { appealId: true, confidence: true },
      });
      const byAppeal: Record<string, number[]> = {};
      for (const l of logs) {
        if (l.confidence === null || l.confidence === undefined) continue;
        byAppeal[l.appealId] = byAppeal[l.appealId] || [];
        byAppeal[l.appealId].push(Number(l.confidence));
      }
      const appealsWithConfidence = report.appeals.map((a: any) => ({
        ...a,
        confidence: (byAppeal[a.id]?.length
          ? byAppeal[a.id].reduce((s, v) => s + v, 0) / byAppeal[a.id].length
          : null),
      }));
      return NextResponse.json({ report: { ...report, appeals: appealsWithConfidence } });
    }
  } catch (_) {
    // ignore enrichment errors
  }
  return NextResponse.json({ report });
}
