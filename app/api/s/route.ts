import { NextRequest, NextResponse } from "next/server";

const SEO = {
  description:
    "Trade anything, anywhere onchain with up to 1000x leverage, 100% decentralized and permissionless directly from your wallet on the Base Network or Mode Network.",
  title: "PRINT3R | Permissionless Decentralized Perpetual Crypto Exchange",
};

const sanitizeId = (str: string = ""): string => {
  return str.replace(/[^a-zA-Z0-9]/g, "");
};

const sanitizeRef = (str: string = ""): string => {
  return str.replace(/[^A-Za-z0-9_]/g, "");
};

function getImageUrl(id: string): string {
  const folderName = "print3r";
  const baseUrl = "https://res.cloudinary.com/dogc09dyt/image/upload";
  return `${baseUrl}/${folderName}/${id}.jpg`;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const id = sanitizeId(searchParams.get("id") || "");
  const ref = sanitizeRef(searchParams.get("ref") || "");
  const imageUrl = getImageUrl(id);
  const rootRedirectURL = "https://v2-app-kappa.vercel.app/";
  const referralParameter = ref ? `?type=traders&ref=${ref}` : "";

  const html = `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="title" content="${SEO.title}" />
      <meta name="description" content="${SEO.description}" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:url" content="${imageUrl}" />
      <meta property="og:site_name" content="PRINT3R" />
      <meta property="og:title" content="${SEO.title}" />
      <meta property="og:description" content="${SEO.description}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:image:width" content="1024" />
      <meta property="og:image:height" content="512" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" content="${SEO.description}" />
      <meta name="twitter:title" content="${SEO.title}" />
      <meta name="twitter:image" content="${imageUrl}" />
      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="140" />
      <meta property="og:image:height" content="140" />
    </head>
    <body>
    </body>
    <script>
      setTimeout(() => {
        window.location.href = "${rootRedirectURL + referralParameter}"
      }, 100);
    </script>
    </html>
  `;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
