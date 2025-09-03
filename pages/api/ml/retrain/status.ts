import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const jobs = await prisma.retrainJob.findMany({ orderBy: { createdAt: "desc" }, take: 20 }).catch(() => [] as any[]);
  res.status(200).json(jobs);
});
