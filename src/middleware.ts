import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
    matcher: [
      "/((?!api|_next/static|_next/image|android-chrome-192x192.png|android-chrome-512x512.png|apple-touch-icon.png|bg-doodle-dark.jpg|bg-doodle-light.jpg|favicon-16x16.png|favicon-32x32.png|favicon.ico|firebase-messaging-sw.js|logo.svg|opengraph-image.png|site.webmanifest|swEnv.js).*)",
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
