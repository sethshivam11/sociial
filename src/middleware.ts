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
    "/videos",
  ],
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token");
  const publicPaths = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/verify-code",
    "/terms",
    "privacy",
  ];

  const isPublicUserProfile =
    /^\/[^\/]+$/.test(path) && !publicPaths.includes(path);

  if (!token && !publicPaths.includes(path) && !isPublicUserProfile) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (token && publicPaths.includes(path)) {
    if (
      path !== "/verify-code" &&
      !request.nextUrl.searchParams.has("username")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    } else {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}
