import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isLoginPage = pathname === "/admin";
  const isAuthenticated = !!req.auth;

  if (!isLoginPage && !isAuthenticated) {
    return Response.redirect(new URL("/admin", req.url));
  }

  if (isLoginPage && isAuthenticated) {
    return Response.redirect(new URL("/admin/dashboard", req.url));
  }
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
