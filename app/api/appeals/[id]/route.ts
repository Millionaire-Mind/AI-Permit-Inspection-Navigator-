import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Removed AppealActionSchema import

export async function GET(_: Request, { params }: { params: { id: string }}) {
  const appeal = await prisma.appeal.findUnique({
    where: { id: params.id },
    include: { notes: true }
  });
  if (!appeal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ appeal });
}

export async function PATCH(req: Request, { params }: { params: { id: string }}) {
  const data = await req.json();

  // Basic validation example (you can improve this)
  if (!data.action) return NextResponse.json({ error: "Missing action" }, { status: 400 });

  const { action, assignTo, note } = data;

  if (action === "approve" || action === "reject") {
    const appeal = await prisma.appeal.update({
      where: { id: params.id },
      data: { status: action, reviewedAt: new Date() }
    });
    return NextResponse.json({ appeal });
  }

  if (action === "assign" && assignTo) {
    const appeal = await prisma.appeal.update({
      where: { id: params.id },
      data: { assignedToId: assignTo }
    });
    return NextResponse.json({ appeal });
  }

  if (action === "note" && note) {
    const created = await prisma.appealNote.create({
      data: { appealId: params.id, content: note, tag: "moderator" }
    });
    return NextResponse.json({ note: created });
  }

  if (action === "reviewed") {
    const appeal = await prisma.appeal.update({
      where: { id: params.id },
      data: { reviewedAt: new Date() }
    });
    return NextResponse.json({ appeal });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}