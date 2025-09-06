import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ReportCreateSchema } from "@/types/api/report";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const client: any = prisma as any;
  const reports = client.report?.findMany
    ? await client.report.findMany({ orderBy: { createdAt: "desc" } })
    : [];
  return NextResponse.json({ reports });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ReportCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, address } = parsed.data as { userId: string; address: string };
    const client: any = prisma as any;

    if (!client.report?.create) {
      return NextResponse.json(
        { error: "Report model not available" },
        { status: 501 }
      );
    }

    const report = await client.report.create({
      data: { userId, address, status: "pending" }
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
