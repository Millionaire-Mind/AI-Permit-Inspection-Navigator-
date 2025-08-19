import { NextResponse } from "next/server";
import { AppealCreateSchema } from "@/types/api/appeal";

// TODO: Implement proper appeals system with database models
// For now, return mock data to prevent build errors

export async function GET() {
  // Mock appeals data
  const appeals = [
    {
      id: "appeal-1",
      userId: "user-123",
      reportId: "report-456",
      title: "Sample Appeal 1",
      description: "This is a sample appeal for testing purposes",
      reason: "Sample reason for appeal 1",
      status: "PENDING",
      priority: "MEDIUM",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "appeal-2",
      userId: "user-456",
      reportId: "report-789",
      title: "Sample Appeal 2",
      description: "This is another sample appeal for testing purposes",
      reason: "Sample reason for appeal 2",
      status: "UNDER_REVIEW",
      priority: "HIGH",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date().toISOString()
    }
  ];
  
  return NextResponse.json({ appeals });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parsed = AppealCreateSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    // Mock appeal creation
    const appeal = {
      id: `appeal-${Date.now()}`,
      userId: parsed.data.userId,
      reportId: parsed.data.reportId || "report-default",
      title: parsed.data.title || "New Appeal",
      description: parsed.data.description || "Appeal description",
      reason: parsed.data.reason,
      status: "PENDING",
      priority: "MEDIUM",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ appeal }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create appeal" },
      { status: 500 }
    );
  }
}
