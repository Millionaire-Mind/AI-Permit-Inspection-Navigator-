import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppealActionSchema } from "@/types/api/appeal";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const client: any = prisma as any;
  if (!client.appeal?.findUnique) return NextResponse.json({ error: "Appeal model not available" }, { status: 501 });
  const appeal = await client.appeal.findUnique({
    where: { id: params.id },
    include: { notes: true },
  });
  if (!appeal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ appeal });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const json = await req.json().catch(() => ({}));
  const parsed = AppealActionSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const { action, assignTo, note } = parsed.data;
  const client: any = prisma as any;
  if (!client.appeal) return NextResponse.json({ error: "Appeal model not available" }, { status: 501 });

  if (action === "approve" || action === "reject") {
    const appeal = await client.appeal.update({
      where: { id: params.id },
      data: { status: action, reviewedAt: new Date() },
    });
    return NextResponse.json({ appeal });
  }

  if (action === "assign" && assignTo) {
    const appeal = await client.appeal.update({
      where: { id: params.id },
      data: { assignedToId: assignTo },
    });
    return NextResponse.json({ appeal });
  }

  if (action === "note" && note) {
    const created = await client.appealNote.create({
      data: { appealId: params.id, content: note, tag: "moderator" },
    });
    return NextResponse.json({ note: created });
  }

  if (action === "reviewed") {
    const appeal = await client.appeal.update({
      where: { id: params.id },
      data: { reviewedAt: new Date() },
    });
    return NextResponse.json({ appeal });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
