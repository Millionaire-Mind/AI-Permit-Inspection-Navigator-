import db from "@/lib/db";

export async function enqueueRetrainJob(modelVersion: string, dataVolume = 0, businessImpact = 0) {
  const priorityScore = Math.round(50 * 0.6 + (businessImpact * 100) * 0.3 + Math.min(dataVolume / 1000, 1) * 10);
  return { id: "stub", status: "queued", priority: priorityScore, sampleCount: dataVolume } as any;
}

// placeholder - compute SLA risk
async function getSLARiskScore(modelVersion: string) {
  // Replace with real computation
  return 0.5;
}
