import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) return res.status(500).json({ error: "stripe_not_configured" });
    const stripe = (eval('require') as any)("stripe")(key, { apiVersion: "2023-10-16" });
    const customerId = req.body?.customerId;
    if (!customerId) return res.status(400).json({ error: "customerId required" });
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

