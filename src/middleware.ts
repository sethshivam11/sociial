import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
    matcher: [
      "/((?!api|_next/static|_next/image|favicon.svg|favicon.ico).*)",
    ],
  };

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("accessToken");
  const publicPaths = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/verify-code",
  ];

  if (!token && !publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (token && publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
