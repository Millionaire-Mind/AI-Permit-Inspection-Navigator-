import type { NextApiRequest, NextApiResponse } from "next";
import { forecastRunnerJob } from "@/lib/jobs/forecastRunner";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    await forecastRunnerJob();
    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("cron forecast error", err);
    return res.status(500).json({ error: "forecast failed" });
  }
}
