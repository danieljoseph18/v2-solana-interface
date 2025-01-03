import type { NextRequest } from "next/server";
import { geolocation } from "@vercel/functions";

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

// Only match earn and trade routes
export const config = {
  matcher: ["/earn", "/trade"],
};

export default function middleware(req: NextRequest) {
  const country = geolocation(req).country || "US";

  if (BLOCKED_COUNTRIES.includes(country)) {
    return new Response("Blocked for legal reasons", { status: 451 });
  }
  return new Response(`Greetings from ${country}, where you are not blocked.`);
}
