export const fetchGeckoTerminalOHLCV = async (
  poolAddress: string,
  timeframe: string,
  aggregate: string,
  beforeTimestamp?: number,
  limit: number = 1000,
  currency: string = "usd",
  token: string = "base"
): Promise<any> => {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  const params = new URLSearchParams({
    network: "solana",
    poolAddress,
    timeframe,
    aggregate,
    limit: limit.toString(),
    currency,
    token,
  });

  if (beforeTimestamp) {
    params.append("beforeTimestamp", beforeTimestamp.toString());
  }

  const url = `${BACKEND_URL}/price/geckoterminal-ohlcv?${params}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(errorBody);
    }

    const data = await response.json();

    // Return the first successful response
    return data;
  } catch (error) {
    console.warn(`Error fetching OHLCV data:`, {
      error: error instanceof Error ? error.message : String(error),
      url,
      network: "solana",
      poolAddress,
      timeframe,
      aggregate,
      beforeTimestamp,
      limit,
      currency,
      token,
    });
    throw new Error("Failed to fetch OHLCV data");
  }
};
