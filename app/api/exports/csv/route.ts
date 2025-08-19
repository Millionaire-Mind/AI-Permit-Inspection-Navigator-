import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Parser } from "json2csv";

export async function GET() {
  const reports = await prisma.report.findMany();
  const parser = new Parser({ fields: ["id","userId","address","status","createdAt"] });
  const csv = parser.parse(reports);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="reports.csv"`
    }
  });
}
