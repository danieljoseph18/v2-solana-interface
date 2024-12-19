import { Bar } from "./types";

export const getLastCandlestickData = async (
  networks: {
    [network: string]: {
      tokenAddress: `0x${string}`;
      poolAddress: `0x${string}`;
    };
  },
  ticker: string,
  period: string,
  limit: number
): Promise<Bar[]> => {
  try {
    const [exchange, pair] = ticker.split(":");
    const [base, quote] = pair.split("/");

    if (exchange.toLowerCase() === "coingecko") {
      try {
        const timeframe = period.includes("m")
          ? "minute"
          : period.includes("h")
          ? "hour"
          : "day";
        const aggregate = period.replace(/[mhd]/g, "");

        const beforeTimestamp = Math.floor(Date.now() / 1000);

        // Fetch data here
        const data: any = {};

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
            (bar, index, self) =>
              index === 0 || bar.time !== self[index - 1].time
          );

        return sortedBars;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch candlestick data");
      }
    } else {
      // Handle CryptoCompare as before
      const urlParameters = {
        fsym: base,
        tsym: quote,
        limit,
        e: exchange,
      };

      let endpoint = "";
      switch (period) {
        case "1m":
        case "5m":
        case "15m":
          endpoint = "data/v2/histominute";
          break;
        case "1h":
        case "4h":
          endpoint = "data/v2/histohour";
          break;
        case "1d":
          endpoint = "data/v2/histoday";
          break;
        default:
          console.log("Period: ", period);
          throw new Error("Unsupported period");
      }

      const query = Object.keys(urlParameters)
        .map(
          (name) =>
            `${name}=${encodeURIComponent(
              urlParameters[name as keyof typeof urlParameters]
            )}`
        )
        .join("&");

      // Make API request here to get data
      const response: any = {};

      // Ensure the response contains the expected structure
      if (!response.Data || !response.Data.Data) {
        console.error("Unexpected CryptoCompare response structure:", response);
        throw new Error("Invalid response from API");
      }

      const data = response.Data.Data;

      return data.map((bar: any) => ({
        time: bar.time * 1000,
        low: bar.low,
        high: bar.high,
        open: bar.open,
        close: bar.close,
      }));
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch candlestick data");
  }
};
