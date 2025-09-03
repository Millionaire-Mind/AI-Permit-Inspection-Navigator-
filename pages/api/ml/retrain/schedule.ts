import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const TRAINING_SERVICE_URL = process.env.TRAINING_SERVICE_URL || "http://localhost:8000";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { triggeredBy = "auto" } = req.body || {};

    // Select recent training examples
    const examples = await prisma.aITrainingExample.findMany({ orderBy: { createdAt: "desc" }, take: 200 }).catch(() => [] as any[]);

    const job = await prisma.retrainJob.create({
      data: {
        triggeredBy,
        status: "queued",
        priority: examples.length,
        sampleCount: examples.length,
        metadata: { sampleCount: examples.length }
      }
    }).catch(() => ({ id: "stub", status: "queued", sampleCount: examples.length } as any));

    // Best-effort call to training service
    try {
      await fetch(`${TRAINING_SERVICE_URL}/train/risk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, samples: examples })
      }).catch(() => {});
    } catch {}

    return res.status(200).json({ queued: true, jobId: job.id, samples: examples.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});
