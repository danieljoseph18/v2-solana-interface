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

export function middleware(request: NextRequest) {
  const geo = (request as any).geo;

  if (BLOCKED_COUNTRIES.includes(geo?.country || "")) {
    return NextResponse.redirect(new URL("/blocked", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|blocked|favicon.ico).*)",
};
