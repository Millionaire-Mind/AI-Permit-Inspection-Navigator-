import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
<<<<<<< HEAD
import { Parser } from "json2csv";
=======

export const dynamic = "force-dynamic";
>>>>>>> 85e1c072 (Save local changes before rebase)

export async function GET() {
  const { Parser } = await import("json2csv");

  const reports = await prisma.report.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
  });

  const rows = reports.map(r => ({
    id: r.id,
    title: r.title ?? "",
    status: r.status ?? "",
    createdAt: r.createdAt?.toISOString() ?? "",
  }));

  const parser = new Parser({ fields: ["id", "title", "status", "createdAt"] });
  const csv = parser.parse(rows);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="reports.csv"',
    },
  });
}