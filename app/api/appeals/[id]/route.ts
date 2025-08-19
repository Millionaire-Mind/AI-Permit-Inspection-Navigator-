import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { id: string }}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const appeal = await prisma.appeal.findUnique({
      where: { id: params.id },
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

    if (!appeal) {
      return NextResponse.json({ error: "Appeal not found" }, { status: 404 });
    }

    return NextResponse.json({ appeal });
  } catch (error) {
    console.error("Error fetching appeal:", error);
    return NextResponse.json(
      { error: "Failed to fetch appeal" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string }}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has permission to update this appeal
    const appeal = await prisma.appeal.findUnique({
      where: { id: params.id },
    });

    if (!appeal) {
      return NextResponse.json({ error: "Appeal not found" }, { status: 404 });
    }

    // Only the appeal owner or admin/moderator can update
    if (appeal.userId !== session.user.id && 
        !['ADMIN', 'MODERATOR', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const body = await req.json();
    
    // Update appeal
    const updatedAppeal = await prisma.appeal.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        reason: body.reason,
        priority: body.priority,
        status: body.status,
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

    return NextResponse.json({ appeal: updatedAppeal });
  } catch (error) {
    console.error("Error updating appeal:", error);
    return NextResponse.json(
      { error: "Failed to update appeal" },
      { status: 500 }
    );
  }
}
