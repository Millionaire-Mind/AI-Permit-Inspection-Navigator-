import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  return res.status(501).json({ error: "Proactive scheduling is not implemented in Phase 1" });
}
