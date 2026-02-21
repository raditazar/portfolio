import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isLoginPage = pathname === "/admin";
  const isAuthenticated = !!req.auth;

  if (!isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
