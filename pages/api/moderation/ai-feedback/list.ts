import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const { start, end, team, category } = req.query;
  try {
    const filters: any = {};
    if (start && end) filters.createdAt = { gte: new Date(String(start)), lte: new Date(String(end)) };
    if (category) filters.category = String(category);
    const anyDb: any = db as any;
    const rows = anyDb.aIFeedback?.findMany ? await anyDb.aIFeedback.findMany({ where: filters, orderBy: { createdAt: "desc" } }) : [];
    return res.status(200).json(rows);
  } catch (err) {
    console.error("AI feedback list error", err);
    return res.status(500).json({ error: "Failed to list feedback" });
  }
}
