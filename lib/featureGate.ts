type FeatureName = "pdf_export" | "advanced_alerts";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

async function getStripeClient() {
  const key = requireEnv("STRIPE_SECRET_KEY");
  const stripe = (eval('require') as any)("stripe")(key, { apiVersion: "2023-10-16" });
  return stripe as any;
}

export async function canUseFeature({ feature, userEmail }: { feature: FeatureName; userEmail?: string | null }) {
  // Basic global toggle for quick testing
  if (process.env.SAAS_DISABLE === "true") return true;

  // Free mode: allow everything if FREE_TIER_ALL="true"
  if (process.env.FREE_TIER_ALL === "true") return true;

  if (feature === "pdf_export" && process.env.FEATURE_PDF_REQUIRE_PRO !== "true") return true;

  if (!userEmail) return false;

  try {
    const stripe = await getStripeClient();
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    const customer = customers.data[0];
    if (!customer) return false;
    const subs = await stripe.subscriptions.list({ customer: customer.id, status: "active", limit: 1 });
    return subs.data.length > 0;
  } catch (e) {
    console.warn("featureGate check failed", e);
    return false;
  }
}

