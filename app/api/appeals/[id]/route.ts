import { NextResponse } from "next/server";
import { AppealActionSchema } from "@/types/api/appeal";

// TODO: Implement proper appeals system with database models
// For now, return mock data to prevent build errors

export async function GET(_: Request, { params }: { params: { id: string }}) {
  // Mock appeal data
  const appeal = {
    id: params.id,
    userId: "user-123",
    reportId: "report-456",
    title: "Sample Appeal",
    description: "This is a sample appeal for testing purposes",
    reason: "Sample reason for appeal",
    status: "PENDING",
    priority: "MEDIUM",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: []
  };
  
  return NextResponse.json({ appeal });
}

export async function PATCH(req: Request, { params }: { params: { id: string }}) {
  try {
    const data = await req.text();
    const parsed = AppealActionSchema.safeParse(JSON.parse(data));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const { action, reason, notes } = parsed.data;

    // Mock appeal update
    const appeal = {
      id: params.id,
      userId: "user-123",
      reportId: "report-456",
      title: "Sample Appeal",
      description: "This is a sample appeal for testing purposes",
      reason: reason || "Sample reason for appeal",
      status: action === "approve" ? "APPROVED" : action === "reject" ? "REJECTED" : "PENDING",
      priority: "MEDIUM",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviewedAt: action === "approve" || action === "reject" ? new Date().toISOString() : null
    };

    return NextResponse.json({ appeal });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update appeal" },
      { status: 500 }
    );
  }
}
