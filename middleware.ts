import { NextRequest, NextResponse } from "next/server";

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

export function middleware(req: NextRequest) {
  const role = req.cookies.get("role")?.value;

  if (!role || !(role in rolesHierarchy)) {
    // No valid role cookie → redirect to login
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
