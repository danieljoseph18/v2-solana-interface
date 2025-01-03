import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Block list:
 * • North Korea
 * • Iran
 * • Syria
 * • Cuba
 * • Venezuela
 * • Afghanistan
 * • Yemen
 * • Iraq
 * • Libya
 * • Somalia
 * • China
 * • Egypt
 * • Morocco
 * • Algeria
 * • Bangladesh
 * • Nepal
 * • US
 * • UK
 * • Russia
 */
const BLOCKED_COUNTRIES = [
  "KP", // North Korea
  "IR", // Iran
  "SY", // Syria
  "CU", // Cuba
  "VE", // Venezuela
  "AF", // Afghanistan
  "YE", // Yemen
  "IQ", // Iraq
  "LY", // Libya
  "SO", // Somalia
  "CN", // China
  "EG", // Egypt
  "MA", // Morocco
  "DZ", // Algeria
  "BD", // Bangladesh
  "NP", // Nepal
  "US", // United States
  "GB", // United Kingdom
  "RU", // Russia
];

const middleware = async (req: NextRequest) => {
  // Check if the request is for static files (_next/static)
  if (req.nextUrl.pathname.startsWith("/_next/static")) {
    return NextResponse.next();
  }

  // Skip check if already on blocked page
  if (req.nextUrl.pathname === "/blocked") {
    return NextResponse.next();
  }

  const country =
    (req as any).geo?.country || req.headers.get("x-vercel-ip-country");

  if (BLOCKED_COUNTRIES.includes(country ?? "")) {
    return NextResponse.redirect(new URL("/blocked", req.url));
  }

  return NextResponse.next();
};

// Add config to specify which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_static (static files)
     * 4. /_vercel (Vercel internals)
     * 5. /favicon.ico, /sitemap.xml (static files)
     */
    "/((?!api|_next|_static|_vercel|favicon.ico|sitemap.xml).*)",
  ],
};

export default middleware;
