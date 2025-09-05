import { NextRequest, NextResponse } from "next/server";
import { logRequest } from "@/lib/logger";
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
  await logRequest(req as any);

  // Scalable rate limit for API paths
  if (req.nextUrl.pathname.startsWith("/api/")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const userId = (token?.id as string | undefined) || undefined;
    const id = userId ? `user:${userId}` : `ip:${getClientIdentifier(req)}`;
    const result = await rateLimitRequest(id);
    if (!result.success) {
      return new NextResponse("Rate limit exceeded", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": String(result.remaining),
          "X-RateLimit-Reset": String(result.reset),
        },
      });
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/editor/:path*", "/protected/:path*"],
};
