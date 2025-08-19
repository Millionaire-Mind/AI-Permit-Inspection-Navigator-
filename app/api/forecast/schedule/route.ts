import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { tasks } = await req.json();
  const created = await prisma.sLATask.createMany({ data: tasks.map((t: any) => ({
    title: t.title,
    description: t.description,
    priority: t.priority ?? "high",
    dueAt: new Date(t.dueAt),
    assignedTeam: t.assignedTeam ?? "moderation",
    status: "open",
    type: "staffing"
  }))});
  return NextResponse.json({ created: created.count });
}
