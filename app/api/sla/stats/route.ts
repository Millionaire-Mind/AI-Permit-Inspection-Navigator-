import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const userId = searchParams.get("userId") || undefined;
  const status = searchParams.get("status") || undefined;
  const slaBreachOnly = searchParams.get("slaBreachOnly") === "1";

  // demo metrics
  const client: any = prisma as any;
  const where: any = {};
  if (userId) where.userId = userId;
  if (status) where.status = status;
  if (from || to) {
    where.createdAt = {};
    if (from) (where.createdAt as any).gte = new Date(from);
    if (to) (where.createdAt as any).lte = new Date(to);
  }
  const total = client.appeal?.count ? await client.appeal.count({ where }) : 0;
  const handled = client.appeal?.count ? await client.appeal.count({ where: { ...where, status: { in: ["approved","rejected"] } } }) : 0;
  const breaches = Math.max(0, Math.floor(handled * 0.12)); // placeholder
  const filteredBreaches = slaBreachOnly ? breaches : breaches;
  return NextResponse.json({
    window: { from, to },
    totals: { appeals: total, handled, slaBreaches: filteredBreaches },
    perCategory: [
      { category: "Electrical", avgResponseMin: 45, slaBreaches: 5 },
      { category: "Plumbing", avgResponseMin: 35, slaBreaches: 2 }
    ]
  });
}
