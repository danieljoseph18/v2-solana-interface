import { useEffect, useMemo, useRef } from "react";
import {
  HistoryCallback,
  LibrarySymbolInfo,
  PeriodParams,
  ResolutionString,
  SubscribeBarsCallback,
} from "@/public/static/charting_library";
import { TVDataProvider } from "./TVDataProvider";
import { SymbolInfo } from "./types";
import { SUPPORTED_RESOLUTIONS } from "./constants";
import { formatTimeInBarToMs } from "./utilts";

const configurationData = {
  supported_resolutions: Object.keys(SUPPORTED_RESOLUTIONS),
  supports_marks: false,
  supports_timescale_marks: false,
  supports_time: true,
  reset_cache_timeout: 100,
};

type Props = {
  dataProvider?: TVDataProvider;
  markPrice: number;
  isMarkPriceReady: boolean;
};

const useTVDatafeed = ({
  dataProvider,
  markPrice,
  isMarkPriceReady,
}: Props) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined
  );
  const resetCacheRef = useRef<() => void | undefined>(undefined);
  const activeTicker = useRef<string | undefined>(undefined);
  const tvDataProvider = useRef<TVDataProvider>(undefined);
  const shouldRefetchBars = useRef<boolean>(false);

  useEffect(() => {
    if (dataProvider && tvDataProvider.current !== dataProvider) {
      tvDataProvider.current = dataProvider;
    }
    if (tvDataProvider.current) {
      tvDataProvider.current.updateMarkPrice(markPrice);
    }
  }, [dataProvider, markPrice]);

  return useMemo(() => {
    return {
      resetCache: function () {
        shouldRefetchBars.current = true;
        resetCacheRef.current?.();
        shouldRefetchBars.current = false;
      },
      datafeed: {
        onReady: (callback: any) => {
          setTimeout(() => callback(configurationData));
        },
        searchSymbols: (
          userInput: string,
          exchange: string,
          symbolType: string,
          onResultReadyCallback: (symbols: any[]) => void
        ) => {
          tvDataProvider.current
            ?.searchSymbols(
              userInput,
              exchange,
              symbolType,
              onResultReadyCallback
            )
            .catch((error) => {
              console.error("[searchSymbols] error:", error);
              onResultReadyCallback([]);
            });
        },
        resolveSymbol(
          symbolName: string,
          onSymbolResolvedCallback: (arg0: LibrarySymbolInfo) => void,
          onResolveErrorCallback: any
        ) {
          tvDataProvider.current
            ?.resolveSymbol(
              symbolName,
              onSymbolResolvedCallback,
              onResolveErrorCallback
            )
            .catch((error) => {
              console.error("[resolveSymbol] error:", error);
              onResolveErrorCallback(error);
            });
        },
        async getBars(
          symbolInfo: SymbolInfo,
          resolution: ResolutionString,
          periodParams: PeriodParams,
          onHistoryCallback: HistoryCallback,
          onErrorCallback: (error: string) => void
        ) {
          if (!SUPPORTED_RESOLUTIONS[resolution]) {
            return onErrorCallback("[getBars] Invalid resolution");
          }
          const { ticker, isStable } = symbolInfo;
          if (activeTicker.current !== ticker) {
            activeTicker.current = ticker;
          }

          try {
            if (!ticker) {
              onErrorCallback("Invalid ticker!");
              return;
            }

            const bars: any = await tvDataProvider.current?.getBars(
              symbolInfo,
              resolution,
              periodParams,
              onHistoryCallback,
              onErrorCallback
            );

            const noData = !bars || bars.length === 0;
            onHistoryCallback(bars, { noData });
          } catch (error) {
            console.error("[getBars] error:", error);
            onErrorCallback("Unable to load historical data!");
          }
        },
        async subscribeBars(
          symbolInfo: SymbolInfo,
          resolution: ResolutionString,
          onRealtimeCallback: SubscribeBarsCallback,
          subscribeUID: string,
          onResetCacheNeededCallback: () => void
        ) {
          console.log("[subscribeBars] triggered:", symbolInfo);
          const { ticker, isStable } = symbolInfo;
          if (!ticker || !isMarkPriceReady) {
            return;
          }
          intervalRef.current && clearInterval(intervalRef.current);
          resetCacheRef.current = onResetCacheNeededCallback;

          try {
            await tvDataProvider.current?.subscribeBars(
              symbolInfo,
              resolution,
              onRealtimeCallback,
              subscribeUID,
              onResetCacheNeededCallback
            );
          } catch (error) {
            console.error("[subscribeBars] error:", error);
          }

          if (symbolInfo.exchange === "CoinGecko") {
            intervalRef.current = setInterval(async function () {
              try {
                const lastBar =
                  tvDataProvider.current?.barsInfo.data[
                    tvDataProvider.current.barsInfo.data.length - 1
                  ];
                if (lastBar && tvDataProvider.current) {
                  const updatedBar = {
                    ...lastBar,
                    close: tvDataProvider.current.markPrice,
                    high: Math.max(lastBar.high, markPrice),
                    low: Math.min(lastBar.low, markPrice),
                  };
                  onRealtimeCallback(formatTimeInBarToMs(updatedBar));
                }
              } catch (error) {
                console.error("[getLiveBar] error:", error);
              }
            }, 2500);
          }
        },
        unsubscribeBars: (subscribeUID: string) => {
          intervalRef.current && clearInterval(intervalRef.current);
          try {
            tvDataProvider.current?.unsubscribeBars(subscribeUID);
          } catch (error) {
            console.error("[unsubscribeBars] error:", error);
          }
        },
      },
    };
  }, [isMarkPriceReady]);
};

export default useTVDatafeed;
