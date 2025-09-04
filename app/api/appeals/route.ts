import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AppealCreateSchema } from "@/types/api/appeal";

export async function GET() {
  const client: any = prisma as any;
  if (!client.appeal?.findMany) return NextResponse.json({ appeals: [] });
  const appeals = await client.appeal.findMany({ orderBy: { createdAt:"desc" }});
  return NextResponse.json({ appeals });
}

export async function POST(req: Request) {
  const data = await req.json();
  const parsed = AppealCreateSchema.safeParse(data);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const client: any = prisma as any;
  if (!client.appeal?.create) return NextResponse.json({ error: "Appeal model not available" }, { status: 501 });
  const appeal = await client.appeal.create({
    data: {
      userId: parsed.data.userId,
      reportId: parsed.data.reportId,
      reason: parsed.data.reason
    }

    const body = await req.json();
    
    // Basic validation
    if (!body.title || !body.description || !body.reason || !body.reportId) {
      return NextResponse.json(
        { error: "Title, description, reason, and reportId are required" },
        { status: 400 }
      );
    }

    const appeal = await prisma.appeal.create({
      data: {
        title: body.title,
        description: body.description,
        reason: body.reason,
        priority: body.priority || "MEDIUM",
        userId: session.user.id,
        reportId: body.reportId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        report: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({ appeal }, { status: 201 });
  } catch (error) {
    console.error("Error creating appeal:", error);
    return NextResponse.json(
      { error: "Failed to create appeal" },
      { status: 500 }
    );
  }
}
