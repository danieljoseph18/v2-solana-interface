import { NextResponse } from "next/server";

// Simple in-memory cache with 24 hour expiry
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ip_address } = body;

    if (!ip_address) {
      return NextResponse.json(
        { error: "IP address is required" },
        { status: 400 }
      );
    }

    // Check cache first
    const cachedData = cache.get(ip_address);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      return NextResponse.json({ userCountry: cachedData.data });
    }

    // If not in cache or expired, fetch from API
    const apiKey = process.env.NEXT_IPGEOLOCATION_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip_address}`
    );
    const data = await response.json();

    const userCountry = {
      country_code2: data.country_code2,
      country_name: data.country_name,
    };

    // Store in cache
    cache.set(ip_address, {
      data: userCountry,
      timestamp: Date.now(),
    });

    return NextResponse.json({ userCountry });
  } catch (error) {
    console.error("Error checking location:", error);
    return NextResponse.json(
      { error: "Error checking geolocation" },
      { status: 503 }
    );
  }
}
