import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { JurisdictionSearchSchema } from '@/types/api/jurisdictions';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const input = {
    q: searchParams.get('q') ?? '',
    state: searchParams.get('state') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
  };
  const parsed = JurisdictionSearchSchema.safeParse(input);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { q, state, limit } = parsed.data;

  const results = await prisma.jurisdiction.findMany({
    where: {
      AND: [
        { name: { contains: q, mode: 'insensitive' } },
        ...(state ? [{ state }] : []),
      ],
    },
    take: limit,
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({ results });
}
