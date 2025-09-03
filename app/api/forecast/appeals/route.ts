import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forecastSeries } from "@/lib/forecast";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const horizon = Number(searchParams.get("horizon") ?? 14);
  let history: { date: string; value: number }[] = [];
  try {
    const client: any = prisma as any;
    if (client?.appeal?.groupBy) {
      const counts = await client.appeal.groupBy({
        by: ["createdAt"],
        _count: { _all: true }
      });
      history = counts.map((c: any) => ({ date: new Date(c.createdAt).toISOString().slice(0, 10), value: c._count._all }));
    }
  } catch (e) {
    // If model not present or query fails, continue with empty history
    history = [];
  }

  const { forecast, lower, upper } = forecastSeries(history, horizon);
  return NextResponse.json({ history, forecast, lower, upper });
}
