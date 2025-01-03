import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  const res = NextResponse.next();

  // Skip check if already on blocked page or homepage
  if (req.nextUrl.pathname !== "/blocked" && req.nextUrl.pathname !== "/") {
    const country =
      (req as any).geo?.country || req.headers.get("x-vercel-ip-country");

    if (BLOCKED_COUNTRIES.includes(country ?? "")) {
      return NextResponse.redirect(new URL("/blocked", req.url));
    }
  }

  return res;
};

export default middleware;
