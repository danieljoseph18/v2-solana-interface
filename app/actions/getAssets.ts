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
      borrowingRate: string;
      fundingRate: string;
      fundingRateVelocity: string;
      lastUpdatedTimestamp: number;
      longOpenInterest: string;
      shortOpenInterest: string;
      availableLiquidity: string;
      volume24h: string;
      lastPrice: string;
    }[] = await response.json();

    const assets: Asset[] = data.map((asset) => ({
      id: asset.id,
      symbol: asset.symbol,
      tokenAddress: asset.tokenAddress,
      poolAddress: asset.poolAddress,
      maxLeverage: Number(asset.maxLeverage),
      maintainanceMargin: Number(asset.maintainanceMargin),
      borrowingRate: Number(asset.borrowingRate),
      fundingRate: Number(asset.fundingRate),
      fundingRateVelocity: Number(asset.fundingRateVelocity),
      lastUpdatedTimestamp: asset.lastUpdatedTimestamp,
      longOpenInterest: Number(asset.longOpenInterest),
      shortOpenInterest: Number(asset.shortOpenInterest),
      availableLiquidity: Number(asset.availableLiquidity),
      volume24h: Number(asset.volume24h),
      lastPrice: Number(asset.lastPrice),
    }));

    return assets;
  } catch (error) {
    throw error;
  }
};
