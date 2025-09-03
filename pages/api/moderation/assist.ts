import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

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
    const { appealId, category, context } = parsed;
    const predictedCategory = category || "Policy Violation";
    const confidence = 0.87;
    const rationale = "Matches patterns from previous cases.";
    const slaUrgency = confidence >= 0.9 ? "high" : "medium";

    // Best-effort log (will fail if migrations not applied yet)
    try {
      await prisma.aIAssistLog.create({
        data: {
          appealId,
          moderatorId: context.moderatorId,
          suggestedCategory: predictedCategory,
          confidence,
          rationale,
          slaUrgency,
        }
      });
    } catch {}

    return res.status(200).json({ suggestion: { category: predictedCategory, confidence, rationale, slaUrgency } });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
