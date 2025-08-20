import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/auth";
import { scheduleRetrainIfNeeded } from "@/lib/ml/retrainScheduler";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { minSamples, triggeredBy } = (req.body as any) || {};
  const result = await scheduleRetrainIfNeeded({ minSamples: minSamples || 200, triggeredBy: triggeredBy || "admin" });
  return res.status(200).json(result);
});
