import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/auth";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  return res.status(501).json({ error: "ML canary deploy is not implemented in Phase 1" });
});
