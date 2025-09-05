import { NextRequest, NextResponse } from "next/server";
import { logRequest } from "@/lib/logger";
import { getToken } from "next-auth/jwt";

// Define roles and their inheritance
const rolesHierarchy: { [role: string]: string[] } = {
  admin: ["admin", "editor", "viewer"],
  editor: ["editor", "viewer"],
  viewer: ["viewer"],
};

// Define route access by minimum required role
const routeRoles: { [pathPattern: string]: string } = {
  "/admin/:path*": "admin",
  "/editor/:path*": "editor",
  "/protected/:path*": "viewer",
};

export async function middleware(req: NextRequest) {
  await logRequest(req as any);

  // Simple rate limit for API paths
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

  // Use NextAuth token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  let role = (token?.role as string | undefined) || req.cookies.get("role")?.value;
  role = role?.toString().toLowerCase();

  // If accessing protected routes, require auth
  const pathname = req.nextUrl.pathname;
  const needsViewer = pathname.startsWith('/protected') || pathname.startsWith('/editor') || pathname.startsWith('/admin');
  if (needsViewer && !role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && !rolesHierarchy[role ?? "viewer"].includes("admin")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/editor") && !rolesHierarchy[role ?? "viewer"].includes("editor")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (pathname.startsWith("/protected") && !rolesHierarchy[role ?? "viewer"].includes("viewer")) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/editor/:path*", "/protected/:path*"],
};
