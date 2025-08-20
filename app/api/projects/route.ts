import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateProjectSchema, ProjectListQuerySchema } from '@/types/api/projects';
import { Prisma } from '@prisma/client';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = CreateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const project = await prisma.project.create({ data: { ...data, params: (data.params as Prisma.InputJsonValue) } });
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
    where: { userId, ...(jurisdictionId ? { jurisdictionId } : {}) },
    take: limit,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: 'desc' },
  });

  const nextCursor = projects.length === limit ? projects[projects.length - 1].id : null;

  return NextResponse.json({ projects, nextCursor });
}