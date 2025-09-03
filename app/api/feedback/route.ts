import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { appealId, suggestionId, accepted, comments, moderatorId, category, confidence } = body ?? {};
  if (!appealId || typeof accepted !== "boolean" || !moderatorId) {
    return NextResponse.json({ error: "appealId, accepted, moderatorId required" }, { status: 400 });
  }

  try {
    const fb = await prisma.aIFeedback.create({
      data: { appealId, suggestionId: suggestionId ?? null, accepted, comments: comments ?? null, moderatorId, category: category ?? null, confidence: confidence ?? null }
    });
    await prisma.aITrainingExample.create({
      data: {
        appealId,
        suggestionId: suggestionId ?? fb.id,
        moderatorId,
        accepted,
        comments: comments ?? null,
        category: category ?? null,
        confidence: confidence ?? null,
      }
    });
    return NextResponse.json({ success: true, feedbackId: fb.id });
  } catch (e) {
    return NextResponse.json({ error: "Failed to record feedback" }, { status: 500 });
  }
}

