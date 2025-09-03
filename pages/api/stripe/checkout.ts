import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!key || !priceId) return res.status(500).json({ error: "stripe_not_configured" });
    const stripe = (eval('require') as any)("stripe")(key, { apiVersion: "2023-10-16" });
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?checkout=cancel`,
    });
    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("stripe checkout error", err);
    return res.status(500).json({ error: err.message });
  }
}

