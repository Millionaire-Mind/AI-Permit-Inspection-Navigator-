import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id?: string };
  if (!id) return res.status(400).json({ error: "Missing job id" });
  const job = await prisma.retrainJob.findUnique({ where: { id } }).catch(() => null);
  if (!job) return res.status(404).json({ error: "Job not found" });
  return res.status(200).json(job);
});
