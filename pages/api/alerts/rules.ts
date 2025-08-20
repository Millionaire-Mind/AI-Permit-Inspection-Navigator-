import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const { prisma } = await import("@/lib/prisma");
      const rules = await prisma.alertRule.findMany({ where: { active: true } });
      return res.status(200).json({ rules });
    }
    if (req.method === "POST") {
      const body = req.body || {};
      const { prisma } = await import("@/lib/prisma");
      const rule = await prisma.alertRule.create({
        data: {
          scope: body.scope ?? "global",
          scopeRef: body.scopeRef ?? null,
          kind: body.kind ?? "forecast_spike",
          threshold: body.threshold ?? 0.2,
          windowHours: body.windowHours ?? 24,
        },
      });
      return res.status(201).json({ rule });
    }
  } catch (err: any) {
    // Defensive: never throw during build-time scans
    return res.status(200).json({ rules: [], error: true });
  }
  res.status(405).end();
}

