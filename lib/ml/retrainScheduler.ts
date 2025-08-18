import db from "@/lib/db";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { collectCandidates } from "./feedbackAggregator";

const TRAINING_SERVICE_URL = process.env.TRAINING_SERVICE_URL || "http://localhost:8000";

export async function scheduleRetrainIfNeeded({ minSamples = 200, triggeredBy = "auto" } = {}) {
  const candidates = await collectCandidates({ days: 90 });
  if (candidates.length < 20) {
    return { queued: false, reason: "not-enough-candidates", count: candidates.length };
  }

  const selected = candidates.slice(0, Math.min(minSamples, candidates.length));
  const appealIds = Array.from(new Set(selected.map((s) => s.appealId)));
  const appeals = await db.report.findMany({
    where: { id: { in: appealIds } },
    select: { id: true, address: true, createdAt: true }
  });
  const appealMap: Record<string, any> = {};
  appeals.forEach((a) => (appealMap[a.id] = a));

  const samples = selected.map((s) => {
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

  const job = await db.retrainJob.create({
    data: {
      triggeredBy,
      status: "queued",
      priority: selected[0]?.score ?? 0,
      sampleCount: samples.length,
      metadata: { sampleCount: samples.length }
    }
  });

  try {
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
    fs.writeFileSync(path.join(tmpDir, `retrain-${job.id}.json`), JSON.stringify({ jobId: job.id, samples }, null, 2));
  } catch (e) {
    console.warn("Failed to write tmp retrain file", e);
  }

  try {
    await db.retrainJob.update({ where: { id: job.id }, data: { status: "running", startedAt: new Date() } });

    const resp = await fetch(`${TRAINING_SERVICE_URL}/train/risk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: job.id, samples })
    });

    if (!resp.ok) {
      const text = await resp.text();
      await db.retrainJob.update({ where: { id: job.id }, data: { status: "failed", error: text, finishedAt: new Date() } });
      return { queued: true, jobId: job.id, status: "failed", error: text };
    }

    const result = await resp.json();
    await db.retrainJob.update({
      where: { id: job.id },
      data: {
        status: "succeeded",
        finishedAt: new Date(),
        metadata: { ...job.metadata, trainingResult: result }
      }
    });

    const ids = selected.map((s) => s.id);
    await db.aiTrainingExample.updateMany({
      where: { id: { in: ids } },
      data: { usedInJobId: job.id, reviewedAt: new Date() }
    });

    return { queued: true, jobId: job.id, status: "succeeded", result };
  } catch (err: any) {
    console.error("Retrain scheduler error:", err);
    await db.retrainJob.update({
      where: { id: job.id },
      data: { status: "failed", error: err.message, finishedAt: new Date() }
    });
    return { queued: true, jobId: job.id, status: "failed", error: err.message };
  }
}
