import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const session: any = await getServerSession(req, res, authOptions as any);
    const email = session?.user?.email;
    if (!email) return res.status(401).json({ error: "unauthorized" });
    const key = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!key || !priceId) return res.status(500).json({ error: "stripe_not_configured" });
    const stripe = (eval('require') as any)("stripe")(key, { apiVersion: "2023-10-16" });
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?checkout=cancel`,
      customer_email: email
    });
    return res.status(200).json({ url: checkout.url });
  } catch (err: any) {
    console.error("stripe checkout error", err);
    return res.status(500).json({ error: err.message });
  }
}

