import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { forecasts } = req.body;
    if (!Array.isArray(forecasts)) return res.status(400).json({ error: "forecasts required" });

    for (const f of forecasts) {
      const { category, total, confidenceRange } = f;
      const sla = await db.sLASettings.findFirst({ where: { category } });
      if (!sla) continue;
      if (total > sla.threshold) {
        await db.audit.create({
          data: {
            action: "SLA_PROACTIVE_SCHEDULING",
            actor: "system",
            detail: { category, total, confidenceRange },
            createdAt: new Date()
          }
        });

        await db.sLATask.create({
          data: {
            title: `Add moderators for ${category}`,
            description: `Predicted ${total} (${confidenceRange?.low}-${confidenceRange?.high}) appeals.`,
            priority: "HIGH",
            dueAt: new Date(),
            assignedTeam: sla.teamId,
            status: "OPEN",
            type: "SLA_PROACTIVE_SCHEDULING"
          }
        });
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("proactiveSchedule error", err);
    res.status(500).json({ error: "failed" });
  }
}
