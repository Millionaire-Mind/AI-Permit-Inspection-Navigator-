import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Minimal server-side logging for now
    console.log("/api/forms POST payload:", data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("/api/forms error:", error);
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}

