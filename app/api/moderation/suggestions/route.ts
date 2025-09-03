import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.aIAssistLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ suggestions: logs });
  } catch {
    return NextResponse.json({ suggestions: [] });
  }
}

