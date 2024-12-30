import {
  CHART_PERIODS,
  LAST_BAR_REFRESH_INTERVAL,
  resolutionMapping,
  SUPPORTED_RESOLUTIONS,
  timezoneOffset,
} from "./constants";
import { getLastCandlestickData } from "./getCandleStickData";
import { fetchGeckoTerminalOHLCV } from "./getOHLCV";
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
    const tokenSymbol = symbolName;

    try {
      const symbolInfo: LibrarySymbolInfo = {
        ticker: `PRINT3R:${tokenSymbol}/USD`,
        name: `${tokenSymbol}/USD`,
        description: `${tokenSymbol}/USD`,
        type: "crypto",
        session: "24x7",
        timezone: "Etc/UTC",
        exchange: "PRINT3R",
        listed_exchange: "PRINT3R",
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

  async fetchSymbolData(
    exchange: string,
    baseSymbol: string,
    quoteSymbol: string
  ): Promise<any> {
    try {
      throw new Error("Not implemented");
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

    try {
      const timeframe = resolutionMapping[resolution].endpoint;
      const aggregate = resolutionMapping[resolution].aggregate;

      const data = await fetchGeckoTerminalOHLCV(
        this.selectedAsset.poolAddress,
        timeframe,
        aggregate,
        to,
        1000,
        "usd",
        "base"
      );

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
          (bar, index, self) => index === 0 || bar.time !== self[index - 1].time
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
      console.error("[getBars]: GeckoTerminal error", error);
      onErrorCallback(error);
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
      this.selectedAsset.poolAddress,
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

      newBar = await this.getGeckoTerminalLiveBar(ticker, resolution);

      if (newBar) {
        this.updateBarsInfo(newBar, resolution as ResolutionString, ticker);
        return newBar;
      }
    } catch (error) {
      console.error("[getLiveBar]: Error fetching live bar:", error);
    }
  }

  async getGeckoTerminalLiveBar(ticker: string, resolution: string) {
    try {
      const period = SUPPORTED_RESOLUTIONS[resolution];
      const bars = await getLastCandlestickData(
        this.selectedAsset.poolAddress,
        ticker,
        period,
        1
      );
      if (bars.length > 0) {
        return bars[0];
      }
    } catch (error: any) {
      console.error(
        "[getGeckoTerminalLiveBar]: Error fetching live bar from CoinGecko:",
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
