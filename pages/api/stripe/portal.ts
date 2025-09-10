import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return res.status(500).json({ error: "stripe_not_configured" });
    const stripe = (eval('require') as any)("stripe")(key, { apiVersion: "2023-10-16" });
    let customerId = req.body?.customerId;
    if (!customerId) {
      const session: any = await getServerSession(req, res, authOptions as any);
      const email = session?.user?.email;
      if (!email) return res.status(401).json({ error: "unauthorized" });
      const user = await (prisma as any).user.findUnique({ where: { email: email.toLowerCase() } });
      if (!user?.customerId) return res.status(400).json({ error: "customer_missing" });
      const customer = await (prisma as any).customer.findUnique({ where: { id: user.customerId } });
      customerId = customer?.stripeCustomerId;
      if (!customerId) return res.status(400).json({ error: "customer_missing" });
    }
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`
    });
    return res.status(200).json({ url: portal.url });
  } catch (err: any) {
    console.error("stripe portal error", err);
    return res.status(500).json({ error: err.message });
  }
}

