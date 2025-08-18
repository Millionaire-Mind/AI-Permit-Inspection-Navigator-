import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Slack interactive payloads can be routed here for approve/reject actions
  // This endpoint should verify Slack signature (omitted for brevity)
  res.status(200).json({ ok: true });
}
