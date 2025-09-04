type FeatureName = "pdf_export" | "advanced_alerts";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function canUseFeature({ feature, userEmail }: { feature: FeatureName; userEmail?: string | null }) {
  // Basic global toggle for quick testing
  if (process.env.SAAS_DISABLE === "true") return true;

  // Free mode: allow everything if FREE_TIER_ALL="true"
  if (process.env.FREE_TIER_ALL === "true") return true;

  if (feature === "pdf_export" && process.env.FEATURE_PDF_REQUIRE_PRO !== "true") return true;

  if (!userEmail) return false;

  try {
    const { prisma } = await import("@/lib/prisma");
    const anyDb: any = prisma as any;
    const user = await anyDb.user.findUnique({ where: { email: userEmail.toLowerCase() } });
    if (!user) return false;
    return (user.subscriptionStatus ?? "inactive") === "active";
  } catch (e) {
    console.warn("featureGate DB check failed", e);
    return false;
  }
}

