import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    openapi: "3.0.0",
    info: { title: "AI Permit Navigator API", version: "1.0.0" },
    paths: {
      "/api/reports": { get: {}, post: {} },
      "/api/appeals": { get: {}, post: {} },
      "/api/appeals/{id}": { get: {}, patch: {} },
      "/api/moderate": { post: {} },
      "/api/exports/pdf": { post: {} },
      "/api/exports/csv": { get: {} },
      "/api/sla/settings": { get: {}, put: {} },
      "/api/sla/stats": { get: {} },
      "/api/alerts/rules": { get: {}, post: {} },
      "/api/alerts/run": { post: {} },
      "/api/forecast/appeals": { get: {} },
      "/api/forecast/schedule": { post: {} }
    }
  });
}
