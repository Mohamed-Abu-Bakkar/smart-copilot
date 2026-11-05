import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Optimistic redirect only. Convex queries and mutations independently enforce
// authenticated ownership; this cookie check is not an authorization boundary.
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/advisor/:path*", "/schemes/:path*", "/documents/:path*", "/business/:path*", "/onboarding/:path*"],
};
