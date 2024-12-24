import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const position = searchParams.get("position");
  const pnlPercentage = searchParams.get("pnlPercentage");
  const entryPrice = searchParams.get("entryPrice");
  const currentPrice = searchParams.get("currentPrice");
  const assetLogo = searchParams.get("assetLogo");
  const isLong = searchParams.get("isLong") === "true";
  const leverage = Number(searchParams.get("leverage"));

  if (
    !position ||
    !pnlPercentage ||
    !entryPrice ||
    !currentPrice ||
    !assetLogo ||
    !isLong ||
    !leverage
  ) {
    return NextResponse.json(
      { error: "Required parameters are missing" },
      { status: 400 }
    );
  }

  try {
    // Load the base image
    const randomVersion = Math.floor(Math.random() * 8) + 1;
    const baseImagePath = path.join(
      process.cwd(),
      "public",
      "img",
      "trade",
      `trade-share-v${randomVersion}.png`
    );
    const baseImageBuffer = await fs.readFile(baseImagePath);
    const baseImage = sharp(baseImageBuffer);

    // Create the SVG content
    const svgContent = `
    <svg width="4197" height="2187" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .position, .long, .short, .pnl, .entry, .current, .price { text-anchor: start; }
          .position { fill: white; font-weight: bold; font-size: 120px; font-family: 'Inter', sans-serif; }
          .long { fill: #30E0A1; font-size: 120px; font-weight: bold; text-transform: uppercase; font-family: 'Inter', sans-serif; }
          .short { fill: #FA2256; font-size: 120px; font-weight: bold; text-transform: uppercase; font-family: 'Inter', sans-serif; }
          .pnl { font-weight: bold; font-size: 320px; font-family: 'Inter', sans-serif; }
          .entry, .current { fill: #CACACA; font-size: 90px; font-family: 'Inter', sans-serif; }
          .price { fill: #F05722; font-weight: bold; font-size: 90px; font-family: 'Inter', sans-serif; }
        </style>
      </defs>
      <image href="${assetLogo}" x="175" y="921" height="120" width="120"/>
      <text x="375" y="921" class="position">${position}</text>
      <text x="1000" y="921" class="${isLong ? "long" : "short"}">${
      isLong ? "Long" : "Short"
    } ${leverage}x</text>
      <text x="175" y="1303" class="pnl" fill="${
        Number(pnlPercentage) > 0 ? "#30E0A1" : "#FA2256"
      }">${Number(pnlPercentage) > 0 ? "+ " : ""}${pnlPercentage}%</text>
      <text x="175" y="1487" class="entry">Entry Price</text>
      <text x="1000" y="1487" class="price">$${entryPrice}</text>
      <text x="175" y="1640" class="current">Current Price</text>
      <text x="1000" y="1640" class="price">$${currentPrice}</text>
    </svg>
  `;

    // Composite the SVG onto the base image
    const modifiedImageBuffer = await baseImage
      .composite([
        {
          input: Buffer.from(svgContent),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();

    const headers = new Headers();
    headers.set("Content-Type", "image/png");
    headers.set("Cache-Control", "public, max-age=86400"); // Cache for 24 hours

    return new NextResponse(modifiedImageBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Error generating image" },
      { status: 500 }
    );
  }
}
