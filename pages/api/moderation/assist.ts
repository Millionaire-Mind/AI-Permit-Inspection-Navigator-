import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { z } from "zod";

const AssistRequestSchema = z.object({
  appealId: z.string(),
  content: z.string(),
  category: z.string().optional(),
  context: z.object({
    moderatorId: z.string(),
    locale: z.string().optional()
  })
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const parsed = AssistRequestSchema.parse(req.body);
    const { appealId, content, category, context } = parsed;
    const appeal = await db.report.findUnique({ where: { id: appealId } });
    if (!appeal) return res.status(404).json({ error: "Appeal not found" });

    // TODO: integrate actual LLM/ML model here
    const predictedCategory = category || "Policy Violation";
    const confidence = 0.87;
    const rationale = "Matches patterns from previous cases.";
    const slaUrgency = confidence >= 0.9 ? "high" : "medium";

    await db.aIAssistLog.create({
      data: {
        appealId,
        moderatorId: context.moderatorId,
        suggestedCategory: predictedCategory,
        confidence,
        rationale,
        slaUrgency
      }
    });

    return res.status(200).json({
      appealId,
      suggestion: {
        category: predictedCategory,
        confidence,
        rationale,
        slaUrgency
      }
    });
  } catch (err: any) {
    console.error("assist error", err);
    return res.status(400).json({ error: err.message });
  }
}
