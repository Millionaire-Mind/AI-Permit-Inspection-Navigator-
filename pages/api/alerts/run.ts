import type { NextApiRequest, NextApiResponse } from "next";
import { runAlertSweep } from "@/lib/alerts";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const result = await runAlertSweep();
  return res.status(200).json(result);
}

