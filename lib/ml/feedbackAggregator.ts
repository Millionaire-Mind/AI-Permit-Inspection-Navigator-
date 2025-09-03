import db from "@/lib/db";
import { subDays } from "date-fns";

export async function collectCandidates({ days = 90 } = {}) {
  const since = subDays(new Date(), days);
  const anyDb: any = db as any;
  const rows = anyDb.aIFeedback?.findMany ? await anyDb.aIFeedback.findMany({
    where: { createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
    take: 5000
  }) : [];

  // Build category counts
  const catCountMap: Record<string, number> = {};
  rows.forEach((r: any) => {
    if (r.category) catCountMap[r.category] = (catCountMap[r.category] || 0) + 1;
  });

  const candidates = rows.map((r: any) => {
    const recencyDays = (Date.now() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 1 - recencyDays / 90);
    const disagreement = r.accepted ? 0 : 1;
    const confidence = r.confidence ?? 0.7;
    const catCount = r.category ? (catCountMap[r.category] || 0) : 0;
    const imbalanceBoost = Math.log10(1 + 100 / Math.max(1, catCount));
    const score = Math.round((disagreement * 0.5 + (1 - confidence) * 0.3 + recencyScore * 0.15) * 100 + imbalanceBoost * 5);
    return {
      id: r.id,
      appealId: r.appealId,
      suggestionId: r.suggestionId,
      moderatorId: r.moderatorId,
      accepted: r.accepted,
      comments: r.comments,
      category: r.category,
      confidence: r.confidence,
      createdAt: r.createdAt,
      score
    };
  });

  candidates.sort((a: any, b: any) => b.score - a.score);
  return candidates;
}
