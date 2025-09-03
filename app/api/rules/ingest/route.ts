import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Rules ingest API is not implemented in Phase 1' }, { status: 501 });
}
