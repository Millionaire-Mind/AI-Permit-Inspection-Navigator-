import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ModerateSchema } from "@/types/api/moderate";

export async function POST(req: Request) {
  const data = await req.json();
  const parsed = ModerateSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const { reportId, action, note, adminUserId } = parsed.data;

  const moderation = await prisma.moderationAction.create({
    data: { reportId, action, note, adminUserId: adminUserId ?? "admin" }
  });

  await prisma.report.update({
    where: { id: reportId },
    data: { status: action === "approve" ? "approved" : action === "reject" ? "rejected" : "flagged" }
  });

  return NextResponse.json({ moderation });
}
