import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { appealId, suggestion, moderatorId, decision } = req.body;
    if (!appealId || !suggestion || !moderatorId || !decision) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Save into AIFeedback + AITrainingExample (for retraining)
    const fb = await db.aIFeedback.create({
      data: {
        appealId,
        suggestionId: suggestion.id ?? null,
        accepted: decision === "accepted",
        comments: suggestion.rationale ?? null,
        moderatorId,
        category: suggestion.category ?? null,
        confidence: suggestion.confidence ?? null
      }
    });

    await db.aITrainingExample.create({
      data: {
        appealId,
        suggestionId: suggestion.id ?? fb.id,
        moderatorId,
        accepted: decision === "accepted",
        comments: suggestion.rationale ?? null,
        category: suggestion.category ?? null,
        confidence: suggestion.confidence ?? null
      }
    });

    return res.status(200).json({ success: true, fb });
  } catch (err: any) {
    console.error("assist feedback error", err);
    return res.status(500).json({ error: "Failed to log feedback" });
  }
}
