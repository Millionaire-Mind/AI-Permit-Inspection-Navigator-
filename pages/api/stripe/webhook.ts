import type { NextApiRequest, NextApiResponse } from "next";

export const config = { api: { bodyParser: false } };

function getRawBody(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    req.on('data', (c: any) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!key || !whSecret) return res.status(500).json({ error: "stripe_not_configured" });
    const stripe = (eval('require') as any)("stripe")(key, { apiVersion: "2023-10-16" });
    const buf = await getRawBody(req);
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(buf, sig, whSecret);

    const { prisma } = await import("@/lib/prisma");
    const anyDb: any = prisma as any;
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const customerId = session.customer as string;
        const email = session.customer_details?.email as string | undefined;
        if (email) {
          const user = await anyDb.user.findUnique({ where: { email } });
          if (user) {
            await anyDb.user.update({ where: { id: user.id }, data: { customerId } });
          }
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        const customerId = sub.customer as string;
        const status = sub.status as string;
        const planId = sub.items?.data?.[0]?.price?.id as string | undefined;
        const currentPeriodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;
        const user = await anyDb.user.findFirst({ where: { customerId } });
        if (user) {
          await anyDb.user.update({ where: { id: user.id }, data: { subscriptionStatus: status } });
          await anyDb.subscription.upsert({
            where: { stripeSubscriptionId: String(sub.id) },
            update: { status, planId, currentPeriodEnd },
            create: {
              userId: user.id,
              stripeCustomerId: customerId,
              stripeSubscriptionId: String(sub.id),
              status,
              planId,
              currentPeriodEnd
            }
          });
        }
        break;
      }
      case 'invoice.payment_succeeded': {
        const inv = event.data.object as any;
        const customerId = inv.customer as string;
        const user = await anyDb.user.findFirst({ where: { customerId } });
        if (user) {
          await anyDb.invoice.upsert({
            where: { stripeInvoiceId: String(inv.id) },
            update: { status: inv.status, amountTotal: inv.amount_total, currency: inv.currency, hostedInvoiceUrl: inv.hosted_invoice_url },
            create: {
              userId: user.id,
              stripeInvoiceId: String(inv.id),
              amountTotal: inv.amount_total,
              currency: inv.currency,
              status: inv.status,
              hostedInvoiceUrl: inv.hosted_invoice_url
            }
          });
        }
        break;
      }
      default:
        break;
    }
    return res.status(200).json({ received: true });
  } catch (err: any) {
    console.error("stripe webhook error", err);
    return res.status(400).send(err.message);
  }
}

