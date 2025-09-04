import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

async function cleanupOldExports(days = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const anyDb: any = prisma as any;
  if (!anyDb.pdfExport?.deleteMany) return { deleted: 0 };
  const r = await anyDb.pdfExport.deleteMany({ where: { createdAt: { lt: cutoff } } });
  return { deleted: r.count ?? 0 };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const secret = req.headers["x-cron-secret"] || req.query.secret;
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    const result = await cleanupOldExports(30);
    return res.status(200).json(result);
  } catch (e: any) {
    console.error("cron exports cleanup error", e);
    return res.status(500).json({ error: e?.message || "failed" });
  }
}

