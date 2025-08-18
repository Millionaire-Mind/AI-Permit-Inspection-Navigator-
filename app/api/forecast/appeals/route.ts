import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { forecastSeries } from "@/lib/forecast";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const horizon = Number(searchParams.get("horizon") ?? 14);

  const counts = await prisma.appeal.groupBy({
    by: ["createdAt"],
    _count: { _all: true }
  }).catch(() => [] as any[]);

  // Coerce to daily buckets (demo)
  const history = counts.map(c => ({ date: new Date(c.createdAt).toISOString().slice(0,10), value: c._count._all }));

  const { forecast, lower, upper } = forecastSeries(history, horizon);
  return NextResponse.json({ history, forecast, lower, upper });
}
