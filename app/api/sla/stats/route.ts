import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // demo metrics
  const client: any = prisma as any;
  const total = client.appeal?.count ? await client.appeal.count() : 0;
  const handled = client.appeal?.count ? await client.appeal.count({ where: { status: { in: ["approved","rejected"] } } }) : 0;
  const breaches = Math.max(0, Math.floor(handled * 0.12)); // placeholder
  return NextResponse.json({
    window: { from, to },
    totals: { appeals: total, handled, slaBreaches: breaches },
    perCategory: [
      { category: "Electrical", avgResponseMin: 45, slaBreaches: 5 },
      { category: "Plumbing", avgResponseMin: 35, slaBreaches: 2 }
    ]
  });
}
