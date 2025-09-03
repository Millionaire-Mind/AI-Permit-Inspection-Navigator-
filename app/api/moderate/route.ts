import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ModerateSchema } from "@/types/api/moderate";

export async function POST(req: Request) {
  const data = await req.json();
  const parsed = ModerateSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const { reportId, action, note, adminUserId } = parsed.data;

  // Log moderation action (best-effort if migrations not applied)
  try {
    await prisma.moderationAction.create({ data: { reportId, action, note, adminUserId: adminUserId ?? "admin" } });
  } catch {}

  // Update report status for approve/reject
  try {
    if (action === "approve" || action === "reject") {
      await prisma.report.update({
        where: { id: reportId },
        data: { status: action === "approve" ? "approved" : "rejected" },
      });
    }
  } catch {}

  return NextResponse.json({ ok: true });
}
