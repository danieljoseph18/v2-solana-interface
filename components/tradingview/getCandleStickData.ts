import { Bar } from "./types";
import { fetchGeckoTerminalOHLCV } from "./getOHLCV";

export const getLastCandlestickData = async (
  poolAddress: string,
  ticker: string,
  period: string,
  limit: number
): Promise<Bar[]> => {
  try {
    const [exchange, pair] = ticker.split(":");
    const [base, quote] = pair.split("/");

    try {
      const timeframe = period.includes("m")
        ? "minute"
        : period.includes("h")
        ? "hour"
        : "day";
      const aggregate = period.replace(/[mhd]/g, "");

      const beforeTimestamp = Math.floor(Date.now() / 1000);

      const data = await fetchGeckoTerminalOHLCV(
        poolAddress,
        timeframe,
        aggregate,
        beforeTimestamp,
        limit
      );

      if (
        !data ||
        !data.data ||
        !data.data.attributes ||
        !data.data.attributes.ohlcv_list
      ) {
        throw new Error("Invalid response from CoinGecko API");
      }

      const bars: Bar[] = data.data.attributes.ohlcv_list.map(
        (item: number[]) => ({
          time: item[0] * 1000, // Convert to milliseconds
          open: item[1],
          high: item[2],
          low: item[3],
          close: item[4],
          volume: item[5],
        })
      );

      // Sort bars by time in ascending order and remove duplicates
      const sortedBars = bars
        .sort((a, b) => a.time - b.time)
        .filter(
          (bar, index, self) => index === 0 || bar.time !== self[index - 1].time
        );

      return sortedBars;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch candlestick data");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch candlestick data");
  }
};
