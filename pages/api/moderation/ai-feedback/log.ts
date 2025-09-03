import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { appealId, suggestionId, accepted, comments, moderatorId, category, confidence } = req.body;
  if (!appealId || suggestionId === undefined || accepted === undefined || !moderatorId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const anyDb: any = db as any;
    const result = anyDb.aIFeedback?.create ? await anyDb.aIFeedback.create({
      data: {
        appealId,
        suggestionId,
        accepted,
        comments,
        moderatorId,
        category,
        confidence
      }
    }) : { id: "mock", appealId, suggestionId, accepted, comments, moderatorId, category, confidence };
    return res.status(200).json({ success: true, feedback: result });
  } catch (err) {
    console.error("AI feedback log error", err);
    return res.status(500).json({ error: "Failed to log feedback" });
  }
}
