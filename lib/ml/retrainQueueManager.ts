import db from "@/lib/db";
import { prisma } from '@/lib/prisma';

export async function enqueueRetrainJob(modelVersion: string, dataVolume = 0, businessImpact = 0) {
  const slaRisk = await getSLARiskScore(modelVersion);
  const slaRiskFactor = slaRisk * 100;
  const businessImpactFactor = businessImpact * 100;
  const freshDataFactor = Math.min(dataVolume / 1000, 1) * 100;
  const priorityScore = Math.round(slaRiskFactor * 0.6 + businessImpactFactor * 0.3 + freshDataFactor * 0.1);

  const anyDb: any = db as any;
  const job = anyDb.retrainJob?.create ? await anyDb.retrainJob.create({
    data: {
      triggeredBy: "auto",
      status: "queued",
      priority: priorityScore,
      sampleCount: dataVolume,
      metadata: { reason: "auto-enqueue", dataVolume }
    }
  }) : { id: "mock", status: "queued", priority: priorityScore, sampleCount: dataVolume };
  return job;
}

export async function getActiveModelVersion(): Promise<string | null> {
  const client: any = prisma as any;
  const prod = client.productionModel?.findFirst ? await client.productionModel.findFirst({ where: { stage: 'production' } }) : null;
  const canary = client.productionModel?.findFirst ? await client.productionModel.findFirst({ where: { stage: 'canary' } }) : null;
  // Prefer model where metadata.active === true; fallback to production
  const activeCanary = canary && (canary.metadata?.active === true);
  const activeProd = prod && (prod.metadata?.active === true);
  if (activeCanary) return canary.modelVersion;
  if (activeProd) return prod.modelVersion;
  return prod?.modelVersion ?? canary?.modelVersion ?? null;
}

// placeholder - compute SLA risk
async function getSLARiskScore(modelVersion: string) {
  // Replace with real computation
  return 0.5;
}
