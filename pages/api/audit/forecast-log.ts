import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const logs = await db.forecastLog.findMany({ orderBy: { triggeredAt: "desc" }, take: 50 });
  res.status(200).json(logs);
});
