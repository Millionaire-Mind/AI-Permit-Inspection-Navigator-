import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/auth";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prisma } = await import("@/lib/prisma");
  const { from, to, userId, status, slaBreachOnly } = req.query as Record<string, string | undefined>;

  const whereAlert: any = {};
  if (from || to) {
    whereAlert.createdAt = {};
    if (from) whereAlert.createdAt.gte = new Date(from);
    if (to) whereAlert.createdAt.lte = new Date(to);
  }

  const anyDb: any = prisma as any;
  const alerts = anyDb.alertEvent?.findMany ? await anyDb.alertEvent.findMany({ where: whereAlert, orderBy: { createdAt: "desc" }, take: 200 }) : [];

  const whereAudit: any = {};
  if (from || to) {
    whereAudit.createdAt = {};
    if (from) whereAudit.createdAt.gte = new Date(from);
    if (to) whereAudit.createdAt.lte = new Date(to);
  }
  // simple status/user filters routed via audit detail if present
  if (userId) whereAudit.actor = userId;
  if (status) whereAudit.action = status;

  const audits = await prisma.audit.findMany({ where: whereAudit, orderBy: { createdAt: "desc" }, take: 200 });

  const events = [
    ...alerts.map((a: any) => ({ id: a.id, at: a.createdAt, kind: a.kind, scope: a.scope, level: a.level, message: a.message, source: "alert" as const })),
    ...audits.map((a: any) => ({ id: a.id, at: a.createdAt, message: a.action, source: "audit" as const }))
  ];

  res.status(200).json({ events });
});

