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
  return NextResponse.json({ report });
}
