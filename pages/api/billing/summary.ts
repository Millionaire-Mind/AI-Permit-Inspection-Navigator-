import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session: any = await getServerSession(req, res, authOptions as any);
  const email = session?.user?.email;
  if (!email) return res.status(401).json({ error: "unauthorized" });
  const anyDb: any = prisma as any;
  const user = await anyDb.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) return res.status(404).json({ error: "not_found" });
  const subscription = await anyDb.subscription.findFirst({ where: { userId: user.id }, orderBy: { updatedAt: "desc" } });
  const invoices = await anyDb.invoice.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 10 });
  return res.status(200).json({ subscription, invoices });
}

