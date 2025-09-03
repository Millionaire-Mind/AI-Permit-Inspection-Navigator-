import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Jurisdictions API is not implemented in Phase 1' }, { status: 501 });
}
