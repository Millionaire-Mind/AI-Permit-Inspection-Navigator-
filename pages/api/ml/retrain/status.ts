import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jobs = await db.retrainJob.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  res.status(200).json(jobs);
});
