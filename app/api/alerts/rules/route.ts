import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin and moderator can view alert rules
    if (!['ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const rules = await prisma.rule.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        jurisdiction: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return NextResponse.json({ rules });
  } catch (error) {
    console.error("Error fetching alert rules:", error);
    return NextResponse.json(
      { error: "Failed to fetch alert rules" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can create alert rules
    if (!['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const body = await req.json();
    
    // Basic validation
    if (!body.code || !body.title || !body.description || !body.jurisdictionId) {
      return NextResponse.json(
        { error: "Code, title, description, and jurisdictionId are required" },
        { status: 400 }
      );
    }

    const rule = await prisma.rule.create({
      data: {
        code: body.code,
        title: body.title,
        description: body.description,
        category: body.category || 'General',
        jurisdictionId: body.jurisdictionId,
        isActive: true,
      },
      include: {
        jurisdiction: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return NextResponse.json({ rule }, { status: 201 });
  } catch (error) {
    console.error("Error creating alert rule:", error);
    return NextResponse.json(
      { error: "Failed to create alert rule" },
      { status: 500 }
    );
  }
}
