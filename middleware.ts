import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const isAdmin = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  if (!isAdmin) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const isAuthenticated = !!token;

  if (!isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
