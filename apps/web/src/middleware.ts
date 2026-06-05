import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dersloop-local-jwt-secret"
);

async function getUser(request: NextRequest) {
  const token = request.cookies.get("dersloop_token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await getUser(request);

  if (pathname.startsWith("/app") || pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  if (pathname.startsWith("/admin") && user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/app/dashboard", request.url));
  }

  if (
    (pathname === "/auth/login" || pathname === "/auth/register") &&
    user
  ) {
    const redirect =
      user.role === "ADMIN" ? "/admin" : "/app/dashboard";
    return NextResponse.redirect(new URL(redirect, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/admin/:path*", "/auth/:path*"],
};
