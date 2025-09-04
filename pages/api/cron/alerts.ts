import type { NextApiRequest, NextApiResponse } from "next";
import { runAlertSweep } from "@/lib/alerts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const secret = req.headers["x-cron-secret"] || req.query.secret;
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    const result = await runAlertSweep();
    return res.status(200).json(result);
  } catch (e: any) {
    console.error("cron alerts error", e);
    return res.status(500).json({ error: e?.message || "failed" });
  }
}

