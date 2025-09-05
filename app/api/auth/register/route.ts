import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const email = String(json.email || '').toLowerCase();
    const password = String(json.password || '');
    const name = json.name ? String(json.name) : null;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    const existing = await (prisma as any).user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await (prisma as any).user.create({ data: { email, password: hash, name, role: 'USER' } });
    return NextResponse.json({ id: user.id, email: user.email, role: user.role });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 });
  }
}