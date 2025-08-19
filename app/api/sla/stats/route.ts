import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // Get appeal statistics
    const total = await prisma.appeal.count();
    const handled = await prisma.appeal.count({ 
      where: { 
        status: { in: ["APPROVED", "REJECTED", "CLOSED"] } 
      } 
    });
    
    // Calculate SLA breaches (simplified logic)
    const breaches = Math.max(0, Math.floor(handled * 0.12)); // Placeholder calculation

    // Get category-specific statistics
    const categoryStats = await prisma.report.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
      where: {
        category: { not: null },
      },
    });

    const perCategory = categoryStats.map(stat => ({
      category: stat.category || 'Uncategorized',
      avgResponseMin: Math.floor(Math.random() * 60) + 30, // Placeholder
      slaBreaches: Math.floor(Math.random() * 10), // Placeholder
    }));

    return NextResponse.json({
      window: { from, to },
      totals: { 
        appeals: total, 
        handled, 
        slaBreaches: breaches 
      },
      perCategory,
    });
  } catch (error) {
    console.error("Error fetching SLA stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch SLA stats" },
      { status: 500 }
    );
  }
}
