"use server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const getAssets = async (): Promise<Asset[]> => {
  try {
    const response = await fetch(`${BACKEND_URL}/markets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to get assets");
    }

    // Interpret data and map to Asset type
    const data: {
      id: string;
      symbol: string;
      tokenAddress: string;
      poolAddress: string;
      maxLeverage: string;
      maintainanceMargin: string;
      takerFee: string;
      makerFee: string;
      fundingRate: string;
      status: string;
      createdAt: string;
      updatedAt: string;
      lastPrice: string;
      volume24h: string;
      openInterest: string;
    }[] = await response.json();

    const assets: Asset[] = data.map((asset) => ({
      id: asset.id,
      symbol: asset.symbol,
      tokenAddress: asset.tokenAddress,
      poolAddress: asset.poolAddress,
      maxLeverage: Number(asset.maxLeverage),
      maintainanceMargin: Number(asset.maintainanceMargin),
      takerFee: Number(asset.takerFee),
      makerFee: Number(asset.makerFee),
      fundingRate: Number(asset.fundingRate),
      status: asset.status as MarketStatus,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
      lastPrice: Number(asset.lastPrice),
      volume24h: Number(asset.volume24h),
      openInterest: Number(asset.openInterest),
    }));

    return assets;
  } catch (error) {
    throw error;
  }
};
