import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/verify-code",
    "/upload-video",
    "/forgot-password",
    "/new-post",
    "/add-story",
    "/call/:path",
    "/story/:path",
    "/messages/:path",
    "/settings/:path",
    "/notifications/:path",
    "/videos"
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
    return NextResponse.redirect(new URL(`/sign-in?next=${path}`, request.url));
  }

  if (token && publicPaths.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
