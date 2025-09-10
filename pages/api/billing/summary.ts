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
  const customer = user.customerId ? await anyDb.customer.findUnique({ where: { id: user.customerId } }) : null;
  const subscription = customer ? await anyDb.subscription.findFirst({ where: { customerId: customer.id }, orderBy: { createdAt: "desc" } }) : null;
  // If Invoice model is not present in new schema, invoices array will be empty; consider using KeyValue if needed
  const invoices: any[] = [];
  return res.status(200).json({ subscription, invoices, customer });
}

