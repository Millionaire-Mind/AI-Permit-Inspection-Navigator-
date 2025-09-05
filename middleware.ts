import { NextRequest, NextResponse } from "next/server";
import { logRequest } from "@/lib/logger";
import { getToken } from "next-auth/jwt";

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
  // Use NextAuth helper to parse JWT and role
  const sessionToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (sessionToken?.role as string | undefined)?.toString().toLowerCase();

  const { pathname, search } = req.nextUrl;

  // Allow auth routes and static assets
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/api/auth");
  const isAsset = pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico");
  if (isAuthRoute || isAsset) {
    // If already authenticated and on /login, redirect to dashboard
    if (sessionToken && pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!role || !(role in rolesHierarchy)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(url);
  }

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
