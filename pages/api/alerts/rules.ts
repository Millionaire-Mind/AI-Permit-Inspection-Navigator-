import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/auth";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    if (req.method === "PUT") {
      const body = req.body || {};
      const id = body.id as string | undefined;
      if (!id) return res.status(400).json({ error: "id required" });
      const { prisma } = await import("@/lib/prisma");
      const rule = await prisma.alertRule.update({
        where: { id },
        data: {
          scope: body.scope ?? undefined,
          scopeRef: body.scopeRef === undefined ? undefined : body.scopeRef,
          kind: body.kind ?? undefined,
          threshold: body.threshold ?? undefined,
          windowHours: body.windowHours ?? undefined,
          active: body.active === undefined ? undefined : !!body.active,
        }
      });
      return res.status(200).json({ rule });
    }

    if (req.method === "DELETE") {
      const id = (req.query.id as string) || (req.body?.id as string);
      if (!id) return res.status(400).json({ error: "id required" });
      const { prisma } = await import("@/lib/prisma");
      await prisma.alertRule.delete({ where: { id } });
      return res.status(204).end();
    }
  } catch (err: any) {
    console.error("API /api/alerts/rules error:", err);
    return res.status(500).json({ error: true });
  }

  res.status(405).end();
})