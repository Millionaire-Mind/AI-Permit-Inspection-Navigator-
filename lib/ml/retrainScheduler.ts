import db from "@/lib/db";
import { collectCandidates } from "./feedbackAggregator";

const TRAINING_SERVICE_URL = process.env.TRAINING_SERVICE_URL || "http://localhost:8000";

export async function scheduleRetrainIfNeeded({ minSamples = 200, triggeredBy = "auto" } = {}) {
  const candidates = await collectCandidates({ days: 90 });
  if (candidates.length < 20) {
    return { queued: false, reason: "not-enough-candidates", count: candidates.length };
  }

  const selected = candidates.slice(0, Math.min(minSamples, candidates.length));
  const appealIds = Array.from(new Set(selected.map((s: any) => s.appealId)));
  const anyDb: any = db as any;
  const appeals = anyDb.report?.findMany ? await anyDb.report.findMany({
    where: { id: { in: appealIds } },
    select: { id: true, address: true, createdAt: true }
  }) : [];
  const appealMap: Record<string, any> = {};
  appeals.forEach((a: any) => (appealMap[a.id] = a));

  const samples = selected.map((s: any) => {
    const appeal = appealMap[s.appealId];
    return {
      id: s.id,
      appealId: s.appealId,
      text: appeal?.address ?? s.comments ?? "",
      label: s.accepted ? "suggestion_correct" : "suggestion_incorrect",
      original_confidence: s.confidence ?? null,
      category: appeal?.category ?? s.category ?? null,
      created_at: s.createdAt
    };
  });

  const job = anyDb.retrainJob?.create ? await anyDb.retrainJob.create({
    data: {
      triggeredBy,
      status: "queued",
      priority: selected[0]?.score ?? 0,
      sampleCount: samples.length,
      metadata: { sampleCount: samples.length }
    }
  }) : { id: "mock-job", status: "queued", metadata: { sampleCount: samples.length } };

  try {
    if (typeof window === 'undefined') {
      const fs = (eval('require') as any)('fs') as typeof import('fs');
      const path = (eval('require') as any)('path') as typeof import('path');
      const tmpDir = path.join(process.cwd(), "tmp");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
      fs.writeFileSync(path.join(tmpDir, `retrain-${job.id}.json`), JSON.stringify({ jobId: job.id, samples }, null, 2));
    }
  } catch (e) {
    console.warn("Failed to write tmp retrain file", e);
  }

  try {
    if (anyDb.retrainJob?.update) {
      await anyDb.retrainJob.update({ where: { id: job.id }, data: { status: "running", startedAt: new Date() } });
    }

    const resp = await fetch(`${TRAINING_SERVICE_URL}/train/risk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: job.id, samples })
    });

    if (!resp.ok) {
      const text = await resp.text();
      if (anyDb.retrainJob?.update) {
        await anyDb.retrainJob.update({ where: { id: job.id }, data: { status: "failed", error: text, finishedAt: new Date() } });
      }
      return { queued: true, jobId: job.id, status: "failed", error: text };
    }

    const result = await resp.json();
    if (anyDb.retrainJob?.update) {
      await anyDb.retrainJob.update({
        where: { id: job.id },
        data: {
          status: "succeeded",
          finishedAt: new Date(),
          metadata: { ...job.metadata, trainingResult: result }
        }
      });
    }

    const ids = selected.map((s: any) => s.id);
    if (anyDb.aiTrainingExample?.updateMany) {
      await anyDb.aiTrainingExample.updateMany({
        where: { id: { in: ids } },
        data: { usedInJobId: job.id, reviewedAt: new Date() }
      });
    }

    return { queued: true, jobId: job.id, status: "succeeded", result };
  } catch (err: any) {
    console.error("Retrain scheduler error:", err);
    if (anyDb.retrainJob?.update) {
      await anyDb.retrainJob.update({
        where: { id: job.id },
        data: { status: "failed", error: err.message, finishedAt: new Date() }
      });
    }
    return { queued: true, jobId: job.id, status: "failed", error: err.message };
  }
}
