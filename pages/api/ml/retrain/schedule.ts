import type { NextApiRequest, NextApiResponse } from "next";
import { scheduleRetrainIfNeeded } from "@/lib/ml/retrainScheduler";
import { requireAdmin } from "@/lib/auth";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { minSamples } = req.body || {};
  const result = await scheduleRetrainIfNeeded({ minSamples: minSamples || 200, triggeredBy: req.body.triggeredBy || "admin" });
  return res.status(200).json(result);
});
