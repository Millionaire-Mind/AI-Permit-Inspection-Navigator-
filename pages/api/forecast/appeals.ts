import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { forecastRunnerJob } from "@/lib/jobs/forecastRunner";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Optionally accept query range param
    const { range = "7d" } = req.query;
    // For real implementation, pass range to forecast logic
    const forecast = await forecastRunnerJob();
    // Trigger proactive scheduling if needed (internal)
    return res.status(200).json({ forecast });
  } catch (err) {
    console.error("forecast appeals error", err);
    res.status(500).json({ error: "Forecast failed" });
  }
}
