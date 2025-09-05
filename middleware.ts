import { NextRequest, NextResponse } from "next/server";
import { logRequest, logApiRequest } from "@/lib/logger";
import { getToken } from "next-auth/jwt";
import { rateLimitRequest, getClientIdentifier } from "@/lib/rateLimit";

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
  // Bypass NextAuth auth endpoints to prevent auth flows from being intercepted
  if (req.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }
  await logRequest(req as any);

  const isApi = req.nextUrl.pathname.startsWith("/api/");
  const start = isApi ? Date.now() : 0;

  // Scalable rate limit for API paths
  if (isApi) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userId = (token?.id as string | undefined) || undefined;
    const id = userId ? `user:${userId}` : `ip:${getClientIdentifier(req)}`;
    const result = await rateLimitRequest(id);
    if (!result.success) {
      const res = new NextResponse("Rate limit exceeded", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": String(result.remaining),
          "X-RateLimit-Reset": String(result.reset),
        },
      });
      // Fire-and-forget logging
      logApiRequest({ method: req.method, path: req.nextUrl.pathname, userId, statusCode: 429, durationMs: Date.now() - start, ua: req.headers.get('user-agent') ?? null });
      return res;
    }
  }

  // Use NextAuth token for RBAC
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

  const res = NextResponse.next();

  if (isApi) {
    // Fire-and-forget logging
    const userId = (token?.id as string | undefined) || undefined;
    res.headers.set('X-Request-Start', String(start));
    const statusCode = res.status || 200;
    const duration = Date.now() - start;
    logApiRequest({ method: req.method, path: req.nextUrl.pathname, userId, statusCode, durationMs: duration, ua: req.headers.get('user-agent') ?? null });
  }

  return res;
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/editor/:path*", "/protected/:path*"],
};
