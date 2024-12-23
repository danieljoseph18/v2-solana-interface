import {
  CHART_PERIODS,
  LAST_BAR_REFRESH_INTERVAL,
  resolutionMapping,
  SUPPORTED_RESOLUTIONS,
  timezoneOffset,
} from "./constants";
import { getLastCandlestickData } from "./getCandleStickData";
import { Bar } from "./types";
import {
  IDatafeedChartApi,
  LibrarySymbolInfo,
  ResolutionString,
  HistoryCallback,
  SubscribeBarsCallback,
  SearchSymbolsCallback,
  PeriodParams,
  ErrorCallback,
} from "@/public/static/charting_library";

const initialHistoryBarsInfo = {
  period: "",
  data: [],
  ticker: "",
};

interface PairData {
  pairs: {
    [symbol: string]: string[];
  };
  isActive: boolean;
  isTopTier: boolean;
}

interface PairsData {
  Data: {
    [exchangeName: string]: PairData;
  };
}

export class TVDataProvider implements IDatafeedChartApi {
  lastBar: Bar | null;
  startTime: number;
  lastTicker: string;
  lastPeriod: string;
  barsInfo: {
    period: string;
    data: Bar[];
    ticker: string;
  };
  priceDecimals: number;
  setChartPrice: (chartPrice: number) => void;
  selectedAsset: Asset;
  subscriptions: {
    [key: string]: (price: number) => void;
  } = {};
  markPrice: number = 0;

  constructor(
    priceDecimals: number,
    setChartPrice: (chartPrice: number) => void,
    selectedAsset: Asset
  ) {
    this.lastBar = null;
    this.startTime = 0;
    this.lastTicker = "";
    this.lastPeriod = "";
    this.barsInfo = initialHistoryBarsInfo;
    this.priceDecimals = priceDecimals;
    this.setChartPrice = setChartPrice;
    this.selectedAsset = selectedAsset;
    this.markPrice =
      selectedAsset.lastPrice && selectedAsset.lastPrice > 0
        ? selectedAsset.lastPrice
        : 0;
  }

  async onReady(callback: any) {
    const configurationData = {
      exchanges: [
        { value: "Binance", name: "Binance", isCentralized: true },
        { value: "Coinbase", name: "Coinbase", isCentralized: true },
        { value: "Kraken", name: "Kraken", isCentralized: true },
        { value: "Poloniex", name: "Poloniex", isCentralized: true },
        { value: "OKEX", name: "OKEX", isCentralized: true },
        { value: "Upbit", name: "Upbit", isCentralized: true },
        { value: "cryptodotcom", name: "cryptodotcom", isCentralized: true },
        { value: "uniswap", name: "uniswap", isCentralized: false },
        { value: "Kucoin", name: "Kucoin", isCentralized: true },
        { value: "Gateio", name: "Gateio", isCentralized: true },
        { value: "Bitstamp", name: "Bitstamp", isCentralized: true },
      ],
      supported_resolutions: ["1m", "5m", "15m", "1h", "4h", "1D", "1W", "1M"],
    };
    setTimeout(() => callback(configurationData));
  }

  async searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback: SearchSymbolsCallback
  ) {
    // const symbols = await this.getAllSymbols();
    // const newSymbols: any = symbols.filter((symbol) => {
    //   const isExchangeValid =
    //     exchange === "" || symbol.symbolInfo.exchange === exchange;
    //   const isFullSymbolContainsInput =
    //     symbol.symbolInfo
    //       .ticker!.toLowerCase()
    //       .indexOf(userInput.toLowerCase()) !== -1;
    //   return isExchangeValid && isFullSymbolContainsInput;
    // });
    // onResultReadyCallback(newSymbols);
  }

  async resolveSymbol(
    symbolName: string,
    onSymbolResolvedCallback: (symbolInfo: LibrarySymbolInfo) => void,
    onResolveErrorCallback: (error: string) => void
  ) {
    try {
      const baseSymbol = symbolName;

      // Fetch all exchanges and their data
      const exchangesResponse: any = {};
      const exchangesData: any = {};

      // Fetch pairs data
      const pairsData: any = {};

      const supportedExchanges: any = [];

      if (supportedExchanges.length === 0) {
        throw new Error(`No exchanges found supporting ${baseSymbol}`);
      }

      const filteredExchanges: any = {};

      // Determine the best exchange based on GradePoints, volume, and preferred quote currency
      const bestExchange: any = Object.entries(filteredExchanges).reduce(
        (best: any, [currentExchangeId, currentExchangeInfo]: [any, any]) => {
          const bestExchangeInfo = filteredExchanges[best[0]];

          // Check if the exchange supports USDT, USDC, or any other quote
          const currentQuotes: any = [];
          const bestQuotes: any = [];

          const getPreferredQuote = (quotes: string[]) => {
            if (quotes.includes("USDT")) return "USDT";
            if (quotes.includes("USDC")) return "USDC";
            return quotes[0]; // Return the first available quote if USDT/USDC not found
          };

          const currentPreferredQuote = getPreferredQuote(currentQuotes);
          const bestPreferredQuote = getPreferredQuote(bestQuotes);

          // Prioritize exchanges with USDT pairs, then USDC pairs, then others
          if (
            currentPreferredQuote === "USDT" &&
            bestPreferredQuote !== "USDT"
          ) {
            return [currentExchangeId, currentExchangeInfo];
          }
          if (
            bestPreferredQuote === "USDT" &&
            currentPreferredQuote !== "USDT"
          ) {
            return best;
          }
          if (
            currentPreferredQuote === "USDC" &&
            bestPreferredQuote !== "USDC"
          ) {
            return [currentExchangeId, currentExchangeInfo];
          }
          if (
            bestPreferredQuote === "USDC" &&
            currentPreferredQuote !== "USDC"
          ) {
            return best;
          }

          // If both exchanges support the same quote currency, compare based on GradePoints and volume
          const currentScore =
            (currentExchangeInfo.GradePoints || 0) *
            (currentExchangeInfo.TOTALVOLUME24H?.BTC || 0);
          const bestScore =
            (bestExchangeInfo.GradePoints || 0) *
            (bestExchangeInfo.TOTALVOLUME24H?.BTC || 0);

          if (currentScore > bestScore) {
            return [currentExchangeId, currentExchangeInfo];
          } else {
            return best;
          }
        }
      );

      // Find the quote symbol
      const bestExchangePairs =
        supportedExchanges.find(
          ([name]: [any]) =>
            name.toLowerCase() === bestExchange[1].InternalName.toLowerCase()
        )?.[1].pairs[baseSymbol] || [];
      let quoteSymbol = bestExchangePairs.includes("USDT")
        ? "USDT"
        : bestExchangePairs.includes("USDC")
        ? "USDC"
        : bestExchangePairs[0]; // Use the first available quote if USDT/USDC not found

      // Generate the full symbol
      const { full: fullSymbol }: any = {};

      // Determine the appropriate pricescale
      const pricescale = this.calculatePricescale(
        this.selectedAsset!.lastPrice!
      );

      // Create the symbolInfo object
      const symbolInfo: LibrarySymbolInfo = {
        ticker: fullSymbol,
        name: `${baseSymbol}/${quoteSymbol}`,
        description: `${baseSymbol}/${quoteSymbol}`,
        type: "crypto",
        session: "24x7",
        timezone: "Etc/UTC",
        exchange: bestExchange[1].InternalName,
        listed_exchange: bestExchange[1].InternalName,
        format: "price",
        minmov: 1,
        pricescale: pricescale,
        has_intraday: true,
        supported_resolutions: [
          "1",
          "5",
          "15",
          "30",
          "60",
          "240",
          "1D",
          "1W",
          "1M",
        ] as ResolutionString[],
        volume_precision: 8,
        data_status: "streaming",
      };

      onSymbolResolvedCallback(symbolInfo);
    } catch (error: any) {
      /**
       * Fallback to CoinGecko API
       */
      const tokenSymbol = symbolName;

      try {
        const symbolInfo: LibrarySymbolInfo = {
          ticker: `CoinGecko:${tokenSymbol}/USD`,
          name: `${tokenSymbol}/USD`,
          description: `${tokenSymbol}/USD`,
          type: "crypto",
          session: "24x7",
          timezone: "Etc/UTC",
          exchange: "CoinGecko",
          listed_exchange: "CoinGecko",
          format: "price",
          minmov: 1,
          pricescale:
            this.calculatePricescale(this.selectedAsset.lastPrice || 0) ||
            100000000,
          has_intraday: true,
          intraday_multipliers: ["1", "5", "15", "30", "60"],
          has_empty_bars: false,
          has_weekly_and_monthly: false,
          supported_resolutions: [
            "1",
            "5",
            "15",
            "60",
            "240",
            "1D",
          ] as ResolutionString[],
          volume_precision: 8,
          visible_plots_set: "ohlcv",
        };

        // Callback with the resolved symbol information
        onSymbolResolvedCallback(symbolInfo);
      } catch (error: any) {
        console.error("[resolveSymbol]: Error", error);
        onResolveErrorCallback(error.message || "Error resolving symbol");
      }
    }
  }

  async fetchSymbolData(
    exchange: string,
    baseSymbol: string,
    quoteSymbol: string
  ): Promise<any> {
    try {
      // Fetch exchange info (make API request here)
      const exchangeData: any = {};

      if (exchangeData.Response === "Error") {
        console.error(
          "[fetchSymbolData]: Error fetching exchange data:",
          exchangeData.Message
        );
        throw new Error(exchangeData.Message);
      }

      // Fetch pair data (make API request here)
      const pairData: any = {};

      if (pairData.Response === "Error") {
        console.error(
          "[fetchSymbolData]: Error fetching pair data: ",
          pairData.Message
        );
        throw new Error(pairData.Message);
      }

      // Combine the data
      return {
        exchange: exchangeData.Data,
        pair: pairData.Data,
      };
    } catch (error) {
      console.error("[fetchSymbolData]: Error fetching symbol data:", error);
      return null;
    }
  }

  async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onHistoryCallback: HistoryCallback,
    onErrorCallback: ErrorCallback
  ) {
    const { from, to, firstDataRequest } = periodParams;

    const parsedSymbol: any = {};

    if (symbolInfo.exchange === "CoinGecko") {
      try {
        const timeframe = resolutionMapping[resolution].endpoint;
        const aggregate = resolutionMapping[resolution].aggregate;

        const data: any = {};

        // Fetch data here

        if (
          !data ||
          !data.data ||
          !data.data.attributes ||
          !data.data.attributes.ohlcv_list ||
          data.data.attributes.ohlcv_list.length === 0
        ) {
          onHistoryCallback([], { noData: true });
          return;
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

        // Sort bars and remove duplicates
        const sortedBars = bars
          .sort((a, b) => a.time - b.time)
          .filter(
            (bar, index, self) =>
              index === 0 || bar.time !== self[index - 1].time
          );

        // Fill in gaps if needed
        const filledBars = await this.fillBarGaps(
          sortedBars,
          CHART_PERIODS[resolution]
        );

        this.barsInfo = {
          period: resolution,
          data: filledBars,
          ticker: symbolInfo.ticker!,
        };

        if (filledBars.length === 0) {
          onHistoryCallback([], { noData: true });
        } else {
          onHistoryCallback(filledBars, { noData: false });
        }
      } catch (error: any) {
        console.error("[getBars]: CoinGecko error", error);
        onErrorCallback(error);
      }
    } else {
      const { endpoint, aggregate } = resolutionMapping[resolution];

      const urlParameters = parsedSymbol
        ? {
            e: parsedSymbol.exchange,
            fsym: parsedSymbol.fromSymbol,
            tsym: parsedSymbol.toSymbol,
            toTs: to,
            limit: 2000,
            aggregate,
          }
        : {
            e: "Binance",
            fsym: "BTC",
            tsym: "USDT",
            toTs: to,
            limit: 2000,
            aggregate,
          };
      const query = Object.keys(urlParameters)
        .map(
          (name) =>
            `${name}=${encodeURIComponent(
              urlParameters[name as keyof typeof urlParameters]
            )}`
        )
        .join("&");
      try {
        // Fetch data here (make API request here)
        const data: any = {};

        if (
          (data.Response && data.Response === "Error") ||
          data.Data.length === 0
        ) {
          onHistoryCallback([], { noData: true });
          return;
        }
        let bars: Bar[] = data.Data.map(
          (bar: {
            time: number;
            low: any;
            high: any;
            open: any;
            close: any;
          }) => ({
            time: bar.time * 1000,
            low: bar.low,
            high: bar.high,
            open: bar.open,
            close: bar.close,
          })
        );

        // Fill in gaps if needed
        bars = await this.fillBarGaps(bars, CHART_PERIODS[resolution]);

        this.barsInfo = {
          period: resolution,
          data: bars,
          ticker: symbolInfo.ticker!,
        };

        onHistoryCallback(bars, { noData: false });
      } catch (error: any) {
        console.error("[getBars]: Get error", error);
        onErrorCallback(error);
      }
    }
  }

  async subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onRealtimeCallback: SubscribeBarsCallback,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void
  ) {
    // Wait for barsInfo to be populated, but only if it's not the first bar
    if (this.barsInfo.data.length > 0 && symbolInfo.ticker) {
      await this.waitForBarsInfo(symbolInfo.ticker, resolution);
    }

    const lastBar = this.barsInfo.data[this.barsInfo.data.length - 1];

    const updatePrice = (price: number) => {
      // Add this check to prevent updating with zero price
      if (price <= 0) {
        return;
      }

      const resolutionKey = SUPPORTED_RESOLUTIONS[resolution] || resolution;
      const barDuration = (CHART_PERIODS[resolutionKey] || 60) * 1000; // Default to 1 minute if not found

      const currentTime = Date.now();
      const lastBar = this.barsInfo.data[this.barsInfo.data.length - 1];

      if (!lastBar && price > 0) {
        // If there's no last bar, create a new one
        const currentTime = Math.floor(Date.now() / 1000) * 1000; // Round to nearest second
        const newBar: Bar = {
          time: currentTime,
          open: price,
          high: price,
          low: price,
          close: price,
        };
        this.updateBarsInfo(newBar, resolution, symbolInfo.ticker!);
        onRealtimeCallback(newBar);
        this.setChartPrice(newBar.close);
      } else if (currentTime >= lastBar.time + barDuration && price > 0) {
        // Create a new bar
        const newBarTime = Math.floor(currentTime / barDuration) * barDuration;
        const newBar: Bar = {
          time: newBarTime,
          open: price,
          high: price,
          low: price,
          close: price,
        };

        this.updateBarsInfo(newBar, resolution, symbolInfo.ticker!);
        onRealtimeCallback(newBar);
      } else {
        const updatedBar: Bar = {
          ...lastBar,
          close: price,
          high: Math.max(lastBar.high, price),
          low: Math.min(lastBar.low, price) || price,
        };
        this.updateBarsInfo(updatedBar, resolution, symbolInfo.ticker!);
        onRealtimeCallback(updatedBar);
        this.setChartPrice(updatedBar.close);
      }
    };

    // Store the update function so it can be called when markPrice changes
    this.subscriptions[subscriberUID] = updatePrice;

    // If we have a valid initial price, update immediately
    const currentTime = Date.now();
    const barDuration = CHART_PERIODS[resolution] * 1000; // Convert to milliseconds
    if (this.markPrice > 0 && currentTime - lastBar.time >= barDuration) {
      updatePrice(this.markPrice);
    }
  }

  unsubscribeBars(subscriberUID: string) {
    const subscription = this.subscriptions[subscriberUID];
    if (subscription) {
      if (typeof subscription === "function") {
        // It's a CoinGecko subscription (updatePrice function)
        delete this.subscriptions[subscriberUID];
      }
    } else {
      console.warn(`No subscription found with UID: ${subscriberUID}`);
    }
  }

  async getTokenLastBars(
    ticker: string,
    period: string,
    limit: number
  ): Promise<Bar[]> {
    return getLastCandlestickData(
      "solana" as any, // @audit very wrong --> just to stop err
      ticker,
      period,
      limit
    );
  }

  async getLastBar(ticker: string, period: string) {
    if (!ticker || !period) {
      throw new Error(
        "Invalid input. Ticker and period are required parameters."
      );
    }
    const [exchange, pair] = ticker.split(":");
    if (!exchange || !pair) {
      throw new Error("Invalid ticker format for getLastBar");
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (
      currentTime - this.startTime > LAST_BAR_REFRESH_INTERVAL ||
      this.lastTicker !== ticker ||
      this.lastPeriod !== period
    ) {
      let prices: Bar[] = [];

      prices = await this.getTokenLastBars(ticker, period, 1);

      if (prices?.length) {
        const lastBar = prices[0];

        const currentCandleTime = await this.getCurrentCandleTime(period);
        const lastCandleTime = currentCandleTime - CHART_PERIODS[period];
        if (
          lastBar.time === currentCandleTime ||
          lastBar.time === lastCandleTime
        ) {
          this.lastBar = { ...lastBar, ticker };
          this.startTime = currentTime;
          this.lastTicker = ticker;
          this.lastPeriod = period;
        }
      }
    }
    return this.lastBar;
  }

  async getLiveBar(ticker: string, resolution: string) {
    const period = SUPPORTED_RESOLUTIONS[resolution];
    if (!ticker || !period) return;

    const [exchange, pair] = ticker.split(":");
    if (!exchange || !pair) {
      console.error("Invalid ticker format in getLiveBar");
      return;
    }

    try {
      let newBar: Bar | null | undefined;

      if (exchange === "CoinGecko") {
        newBar = await this.getCoinGeckoLiveBar(ticker, resolution);
      } else {
        newBar = await this.getCryptoCompareLiveBar(ticker, resolution);
      }

      if (newBar) {
        this.updateBarsInfo(newBar, resolution as ResolutionString, ticker);
        return newBar;
      }
    } catch (error) {
      console.error("[getLiveBar]: Error fetching live bar:", error);
    }
  }

  async getCoinGeckoLiveBar(ticker: string, resolution: string) {
    try {
      // Implement live bar fetching for CoinGecko
      // This could be similar to getLastCandlestickData or a real-time data subscription
      const period = SUPPORTED_RESOLUTIONS[resolution];
      const bars = await getLastCandlestickData(
        "solana" as any, // @audit very wrong --> just to stop err
        ticker,
        period,
        1
      );
      if (bars.length > 0) {
        return bars[0];
      }
    } catch (error: any) {
      console.error(
        "[getCoinGeckoLiveBar]: Error fetching live bar from CoinGecko:",
        error
      );
    }
    return undefined;
  }

  async getCryptoCompareLiveBar(ticker: string, resolution: string) {
    try {
      const lastBar = await this.getLastBar(ticker, resolution);
      return lastBar;
    } catch (error: any) {
      console.error(
        "[getCryptoCompareLiveBar]: Error fetching live bar from CryptoCompare:",
        error
      );
    }
    return undefined;
  }

  async fillBarGaps(bars: Bar[], period: number): Promise<Bar[]> {
    const filledBars: Bar[] = [];
    for (let i = 0; i < bars.length - 1; i++) {
      const currentBar = bars[i];
      const nextBar = bars[i + 1];
      filledBars.push(currentBar);
      let time = currentBar.time;
      while ((time += period) < nextBar.time) {
        filledBars.push({
          time,
          open: currentBar.close,
          high: currentBar.close,
          low: currentBar.close,
          close: currentBar.close,
        });
      }
    }
    filledBars.push(bars[bars.length - 1]);
    return filledBars;
  }

  getCurrentCandleTime = async (period: string) => {
    // Converts current time to seconds, rounds down to nearest period, adds timezone offset, and converts back to milliseconds
    const periodSeconds = CHART_PERIODS[period];
    return (
      Math.floor(Date.now() / 1000 / periodSeconds) * periodSeconds +
      timezoneOffset
    );
  };

  private updateBarsInfo(
    newBar: Bar,
    resolution: ResolutionString,
    ticker: string
  ) {
    // Ensure newBar.time is in milliseconds
    newBar.time = newBar.time < 10000000000 ? newBar.time * 1000 : newBar.time;
    if (
      this.barsInfo.period === resolution &&
      this.barsInfo.ticker === ticker
    ) {
      const lastBar = this.barsInfo.data[this.barsInfo.data.length - 1];

      if (newBar.time > lastBar.time) {
        // Only add a new bar if the time has changed
        this.barsInfo.data.push(newBar);
      } else {
        // Update the last bar
        this.barsInfo.data[this.barsInfo.data.length - 1] = newBar;
      }
    } else {
      // If the resolution or ticker has changed, reset barsInfo
      this.barsInfo = {
        period: resolution,
        data: [newBar],
        ticker: ticker,
      };
    }

    // Ensure all existing bars in barsInfo.data are in milliseconds
    this.barsInfo.data = this.barsInfo.data.map((bar) => ({
      ...bar,
      time: bar.time < 10000000000 ? bar.time * 1000 : bar.time,
    }));
  }

  private async waitForBarsInfo(
    ticker: string,
    resolution: ResolutionString,
    maxAttempts = 10
  ) {
    for (let i = 0; i < maxAttempts; i++) {
      if (
        this.barsInfo.ticker === ticker &&
        this.barsInfo.period === resolution &&
        this.barsInfo.data.length > 0
      ) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms before next check
    }
    console.warn(`BarsInfo not populated after ${maxAttempts} attempts`);
  }

  updateMarkPrice(newPrice: number) {
    if (newPrice > 0) {
      this.markPrice = newPrice;
      this.updateLivePrice(newPrice);
    }
  }

  updateSelectedAsset(newAsset: Asset) {
    this.selectedAsset = newAsset;
  }

  updateLivePrice(price: number) {
    Object.entries(this.subscriptions).forEach(([uid, subscription]) => {
      if (typeof subscription === "function") {
        subscription(price);
      }
    });
  }

  private calculatePricescale(price: number): number {
    if (price === 0) return 100000000; // Default to 10^8 if price is 0
    const magnitude = Math.floor(Math.log10(1 / price)) + 1;
    return Math.pow(10, Math.max(magnitude, 8));
  }
}
