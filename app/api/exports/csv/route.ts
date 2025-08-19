import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        user: true
      }
    });

    // Use runtime dynamic import for CSV generation
    const { Parser } = await import('json2csv');

    const fields = [
      'id',
      'userId',
      'address',
      'status',
      'createdAt',
      'user.name',
      'user.email'
    ];

    const opts = { fields };
    const parser = new Parser(opts);

    // Transform data to flatten nested objects
    const flattenedData = reports.map(report => ({
      id: report.id,
      userId: report.userId,
      address: report.address,
      status: report.status,
      createdAt: report.createdAt,
      'user.name': report.user?.name || 'N/A',
      'user.email': report.user?.email || 'N/A'
    }));

    const csv = parser.parse(flattenedData);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="reports-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  } catch (error) {
    console.error("CSV export error:", error);
    return NextResponse.json(
      { error: "Failed to export CSV" },
      { status: 500 }
    );
  }
}
