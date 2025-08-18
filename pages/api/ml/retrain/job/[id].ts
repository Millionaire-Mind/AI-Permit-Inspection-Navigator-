import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id?: string };
  if (!id) return res.status(400).json({ error: "Missing job id" });
  const job = await db.retrainJob.findUnique({ where: { id } });
  if (!job) return res.status(404).json({ error: "Job not found" });
  return res.status(200).json(job);
});
