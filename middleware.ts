import { NextRequest, NextResponse } from "next/server";
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
