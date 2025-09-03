import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { IngestRuleSourceSchema } from '@/types/api/rules';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = IngestRuleSourceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { jurisdictionId, sourceType, url, title, meta } = parsed.data;

  const client: any = prisma as any;
  const source = client.ruleSource?.create ? await client.ruleSource.create({
    data: { jurisdictionId, sourceType, url: url ?? null, title: title ?? null, meta: meta ?? {} },
  }) : { id: "mock", jurisdictionId, sourceType, url, title, meta };

  // Ingest placeholder:
  // Later, attach your scrapers to fetch docs into SourceDocument and parse rules into PermitRequirement.
  return NextResponse.json({ source }, { status: 201 });
}
