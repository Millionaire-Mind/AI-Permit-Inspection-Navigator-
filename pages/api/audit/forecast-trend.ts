import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const logs = await db.forecastLog.findMany({ orderBy: { triggeredAt: "asc" } });
  const data = logs.map((log) => ({
    date: log.triggeredAt,
    count: Array.isArray(log.results) ? log.results.reduce((acc: number, cur: any) => acc + (cur.predicted || 0), 0) : 0
  }));
  res.status(200).json(data);
});
