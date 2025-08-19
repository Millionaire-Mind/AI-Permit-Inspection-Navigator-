import { NextResponse } from "next/server";

// TODO: Implement proper SLA stats with database models
// For now, return mock data to prevent build errors

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // Mock SLA metrics
  const total = 25; // Mock total appeals
  const handled = 20; // Mock handled appeals
  const breaches = Math.max(0, Math.floor(handled * 0.12)); // placeholder
  
  return NextResponse.json({
    window: { from, to },
    totals: { appeals: total, handled, slaBreaches: breaches },
    perCategory: [
      { category: "Electrical", avgResponseMin: 45, slaBreaches: 5 },
      { category: "Plumbing", avgResponseMin: 35, slaBreaches: 2 }
    ]
  });
}
