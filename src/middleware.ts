import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { publicPaths } from "./lib/helpers";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

const authPaths = ["/sign-in", "/sign-up"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token");

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (token && authPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && !publicPaths.includes(pathname) && !authPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}