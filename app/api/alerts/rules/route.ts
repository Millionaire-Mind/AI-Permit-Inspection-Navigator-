import { NextResponse } from "next/server";

// TODO: Implement proper alert rules system with database models
// For now, return mock data to prevent build errors

export async function GET() {
  // Mock alert rules data
  const rules = [
    {
      id: "rule-1",
      scope: "global",
      kind: "forecast_spike",
      threshold: 0.2,
      windowHours: 24,
      isActive: true
    },
    {
      id: "rule-2", 
      scope: "project",
      kind: "sla_breach",
      threshold: 0.1,
      windowHours: 48,
      isActive: true
    }
  ];
  
  return NextResponse.json({ rules });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Mock rule creation
    const rule = {
      id: `rule-${Date.now()}`,
      scope: body.scope ?? "global",
      scopeRef: body.scopeRef ?? null,
      kind: body.kind ?? "forecast_spike",
      threshold: body.threshold ?? 0.2,
      windowHours: body.windowHours ?? 24,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json({ rule }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create alert rule" },
      { status: 500 }
    );
  }
}
