import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const anyDb: any = prisma as any;
  const users = await anyDb.user.findMany({ select: { id: true, name: true, email: true, customerId: true, subscriptionStatus: true } });
  const subs = await anyDb.subscription.findMany({ orderBy: { updatedAt: "desc" } });
  const invs = await anyDb.invoice.findMany({});
  const subByUser: Record<string, any> = {};
  subs.forEach((s: any) => { if (!subByUser[s.userId]) subByUser[s.userId] = s; });
  const invCountByUser: Record<string, number> = {};
  invs.forEach((i: any) => { invCountByUser[i.userId] = (invCountByUser[i.userId] || 0) + 1; });
  const items = users.map((u: any) => ({
    userId: u.id,
    name: u.name,
    email: u.email,
    customerId: u.customerId,
    status: u.subscriptionStatus,
    planId: subByUser[u.id]?.planId ?? null,
    currentPeriodEnd: subByUser[u.id]?.currentPeriodEnd ?? null,
    invoiceCount: invCountByUser[u.id] || 0
  }));
  return res.status(200).json({ items });
});

