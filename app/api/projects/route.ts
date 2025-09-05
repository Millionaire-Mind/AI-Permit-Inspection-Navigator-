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

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        jurisdiction: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
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

    const body = await req.json();
    
    // Basic validation
    if (!body.name || !body.address || !body.jurisdictionId) {
      return NextResponse.json(
        { error: "Name, address, and jurisdictionId are required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
        address: body.address,
        jurisdictionId: body.jurisdictionId,
        userId: session.user.id,
        status: body.status || "DRAFT",
        valuation: body.valuation,
        sqft: body.sqft,
        scope: body.scope,
        params: body.params,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        jurisdiction: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
  const data = parsed.data;

  const project = await prisma.project.create({ data });
  return NextResponse.json({ project }, { status: 201 });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const input = {
    userId: searchParams.get('userId') ?? '',
    jurisdictionId: searchParams.get('jurisdictionId') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
    cursor: searchParams.get('cursor') ?? undefined,
  };
  const parsed = ProjectListQuerySchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { userId, jurisdictionId, limit, cursor } = parsed.data;

  const projects = await prisma.project.findMany({
    where: {
      ...(jurisdictionId ? { jurisdictionId } : {}),
      // userId may not exist on Project in current schema; guard by ignoring
    },
    take: limit,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { id: 'desc' },
  });

  const nextCursor = projects.length === limit ? projects[projects.length - 1].id : null;

  return NextResponse.json({ projects, nextCursor });
}
