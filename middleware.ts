import { NextRequest, NextResponse } from "next/server";
import { logRequest } from "@/lib/logger";
import { jwtVerify } from "jose";

// Define roles and their inheritance
const rolesHierarchy: { [role: string]: string[] } = {
  admin: ["admin", "editor", "viewer"], // admin inherits editor + viewer
  editor: ["editor", "viewer"],         // editor inherits viewer
  viewer: ["viewer"],                    // viewer has no inheritance
};

// Define route access by minimum required role
const routeRoles: { [pathPattern: string]: string } = {
  "/admin/:path*": "admin",
  "/editor/:path*": "editor",
  "/protected/:path*": "viewer",
};

export async function middleware(req: NextRequest) {
  // Basic request logging
  await logRequest(req as any);

  // Simple rate limit (per IP per minute) using in-memory Map (best-effort)
  // For production, replace with Redis or durable store.
  try {
    const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";
    const key = `${ip}:${new Date().getUTCFullYear()}-${new Date().getUTCMonth()}-${new Date().getUTCDate()}-${new Date().getUTCHours()}-${new Date().getUTCMinutes()}`;
    // @ts-ignore
    globalThis.__rate = globalThis.__rate || new Map<string, number>();
    // @ts-ignore
    const store: Map<string, number> = globalThis.__rate;
    const count = (store.get(key) || 0) + 1;
    store.set(key, count);
    const limit = Number(process.env.RATE_LIMIT_PER_MIN || 120);
    if (count > limit && req.nextUrl.pathname.startsWith("/api/")) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }
  } catch {}
  // Try NextAuth JWT (if using session: 'jwt')
  let role: string | undefined = undefined;
  const token = req.cookies.get("next-auth.session-token")?.value || req.cookies.get("__Secure-next-auth.session-token")?.value;
  if (token && process.env.NEXTAUTH_SECRET) {
    try {
      const { payload } = await jwtVerify(new TextEncoder().encode(token), new TextEncoder().encode(process.env.NEXTAUTH_SECRET));
      // @ts-ignore
      role = payload?.role?.toString().toLowerCase();
    } catch {}
  }

  if (!role) {
    // Fallback to legacy cookie for local demos
    role = req.cookies.get("role")?.value;
  }

  if (!role || !(role in rolesHierarchy)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const pathname = req.nextUrl.pathname;

  // Check each static path pattern
  if (pathname.startsWith("/admin") && !rolesHierarchy[role].includes("admin")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/editor") && !rolesHierarchy[role].includes("editor")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/protected") && !rolesHierarchy[role].includes("viewer")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Role allowed → continue
  return NextResponse.next();
}

// Use static matcher array to satisfy Next.js 14
export const config = {
  matcher: ["/admin/:path*", "/editor/:path*", "/protected/:path*"],
};
