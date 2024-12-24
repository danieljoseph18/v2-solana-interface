import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TVDataProvider } from "@/components/tradingview/TVDataProvider";
import {
  ResolutionString,
  ChartData,
  widget,
  IChartingLibraryWidget,
  IPositionLineAdapter,
} from "@/public/static/charting_library";
import useTVDatafeed from "@/components/tradingview/useTVDatafeed";
import useWindowSize from "@/hooks/useWindowSize";
import { SaveLoadAdapter } from "@/components/tradingview/SaveLoadAdapter";
import { TV_SAVE_LOAD_CHARTS_KEY } from "@/config/tvStorage";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  defaultWidgetOptions,
  disabledFeatures,
} from "./trading-view-settings";
import Loader from "./Loader";
import { FaQuestionCircle } from "react-icons/fa";
import { useTimeoutFn } from "react-use";

export type ChartLine = {
  price: number;
  title: string;
  type: string;
  symbol: string;
};

interface TradingViewChartProps {
  asset: Asset;
  markPrice: number;
  assetForPrice: string; // The asset the price is for
  setChartPrice: React.Dispatch<React.SetStateAction<number>>;
  symbol: string;
  priceDecimals: number;
  period: ResolutionString;
  savedShouldShowPositionLines: boolean;
  chartLines: ChartLine[];
  onSelectToken: (token: any) => void;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  asset,
  markPrice,
  assetForPrice,
  symbol,
  priceDecimals,
  period,
  savedShouldShowPositionLines,
  chartLines,
  onSelectToken,
  setChartPrice,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tvCharts, setTvCharts] = useLocalStorage<ChartData[] | undefined>(
    TV_SAVE_LOAD_CHARTS_KEY,
    []
  );
  const tvDataProvider = useMemo(
    () => new TVDataProvider(priceDecimals, setChartPrice, asset),
    [priceDecimals, setChartPrice, asset]
  );

  const { datafeed } = useTVDatafeed({
    dataProvider: tvDataProvider,
    markPrice,
    isMarkPriceReady: assetForPrice === asset.symbol && markPrice !== 0,
  });
  const tvWidgetRef = useRef<IChartingLibraryWidget | null>(null);
  const [chartReady, setChartReady] = useState(false);
  const [chartDataLoading, setChartDataLoading] = useState(true);
  const [noDataAvailable, setNoDataAvailable] = useState(false);
  // Show GeckoTerminal only when explicitly requested
  const [showGeckoTerminal, setShowGeckoTerminal] = useState(false);
  const linesRef = useRef<IPositionLineAdapter[]>([]);
  const [chartError, setChartError] = useState<string | null>(null);

  const [, , resetTimeout] = useTimeoutFn(() => {
    if (chartDataLoading) {
      setChartDataLoading(false);
      setNoDataAvailable(true);
    }
  }, 5000);

  const initializeChart = useCallback(() => {
    console.log("Initializing chart with:", {
      symbol,
      period,
      showGeckoTerminal,
    });
    setChartReady(false);
    setChartDataLoading(true);
    setNoDataAvailable(false);
    setChartError(null);

    if (tvWidgetRef.current) {
      console.log("Removing existing chart instance");
      tvWidgetRef.current.remove();
      tvWidgetRef.current = null;
    }

    if (!chartContainerRef.current) {
      console.error("Chart container ref is null");
      setChartError("Failed to initialize chart: container not found");
      return;
    }

    let widgetOptions: any = {
      ...defaultWidgetOptions,
      symbol: symbol,
      datafeed: datafeed,
      interval: period as ResolutionString,
      container: chartContainerRef.current,
      library_path: "/static/charting_library/",
      disabled_features: disabledFeatures,
      enabled_features: ["use_localstorage_for_settings"],
      load_last_chart: true,
      save_load_adapter: new SaveLoadAdapter(
        tvCharts,
        setTvCharts,
        onSelectToken
      ) as any,
    };

    console.log("Creating new chart with options:", widgetOptions);

    try {
      const tvWidget = new widget(widgetOptions);

      tvWidget.onChartReady(() => {
        console.log("Chart is ready");
        tvWidgetRef.current = tvWidget;
        setChartReady(true);
        tvWidget.applyOverrides({
          "paneProperties.background": "#101014",
          "paneProperties.backgroundType": "solid",
        });
        tvWidget.activeChart().dataReady(() => {
          console.log("Chart data is ready");
          setChartDataLoading(false);
        });
      });
    } catch (error: any) {
      console.error("Error initializing TradingView widget:", error);
      setChartError(`Failed to initialize chart: ${error.message}`);
      setChartDataLoading(false);
    }
  }, [symbol, period, datafeed]);

  const drawLineOnChart = useCallback(
    (title: string, price: number, color: string, textColor: string) => {
      if (chartReady && tvWidgetRef.current?.activeChart?.().dataReady()) {
        const chart = tvWidgetRef.current.activeChart();
        const positionLine = chart.createPositionLine({ disableUndo: true });

        return positionLine
          .setText(title)
          .setPrice(price)
          .setQuantity("")
          .setLineStyle(2)
          .setLineLength(25)
          .setBodyFont(`normal 12pt "Relative", sans-serif`)
          .setBodyTextColor(textColor ?? "#fff")
          .setLineColor(color)
          .setBodyBackgroundColor(color)
          .setBodyBorderColor("#3a3e5e");
      }
    },
    [chartReady]
  );

  useEffect(() => {
    if (chartDataLoading) {
      resetTimeout();
    }
  }, [chartDataLoading, resetTimeout]);

  useEffect(() => {
    const updateLines = () => {
      // Remove existing lines
      linesRef.current.forEach((line) => line?.remove());
      linesRef.current = [];

      if (savedShouldShowPositionLines && chartReady) {
        chartLines.forEach((line) => {
          let color;
          let textColor;
          switch (line.type) {
            case "Take Profit":
              color = "#00ff00"; // Green for take profit
              textColor = "#111111"; // Black for take profit
              break;
            case "Stop Loss":
              color = "#ff0000"; // Red for stop loss
              textColor = "#FFFFFF"; // White for stop loss
              break;
            case "Buy Limit":
            case "Sell Limit":
              color = "#F05722"; // Orange for limit orders
              textColor = "#FFFFFF"; // White for limit orders
              break;
            case "liquidation":
              color = "#ff0000"; // Red for liquidation
              textColor = "#FFFFFF"; // White for liquidation
              break;
            default:
              color = "#758091"; // Default gray color
              textColor = "#FFFFFF"; // White for default
          }
          const newLine = drawLineOnChart(
            line.title,
            line.price,
            color,
            textColor
          );
          if (newLine) {
            linesRef.current.push(newLine);
          }
        });
      }
    };

    updateLines();
  }, [savedShouldShowPositionLines, chartLines, drawLineOnChart, chartReady]);

  useEffect(() => {
    if (
      chartReady &&
      tvWidgetRef.current &&
      symbol !== tvWidgetRef.current?.activeChart?.().symbol()
    ) {
      tvWidgetRef.current.setSymbol(
        symbol,
        tvWidgetRef.current.activeChart().resolution(),
        () => {}
      );
    }
  }, [symbol, chartReady, period]);

  // Effect to set the container height
  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.offsetHeight;
      containerRef.current.style.height = `${height}px`;
    }
  }, []);

  useEffect(() => {
    if (!showGeckoTerminal) {
      initializeChart();
    } else {
      if (tvWidgetRef.current) {
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
      }
      setChartReady(false);
      setChartDataLoading(false);
      setChartError(null);
    }

    return () => {
      if (tvWidgetRef.current) {
        tvWidgetRef.current.remove();
        tvWidgetRef.current = null;
      }
      setChartReady(false);
      setChartDataLoading(true);
      setChartError(null);
    };
  }, [showGeckoTerminal, symbol, period, initializeChart]);

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      {chartDataLoading && <Loader />}
      {chartError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
          <p>{chartError}</p>
        </div>
      )}
      <div
        id="tv_chart_container"
        className="TVChartContainer"
        ref={chartContainerRef}
        style={{
          visibility: !chartDataLoading && !chartError ? "visible" : "hidden",
          position: "relative",
        }}
      />
    </div>
  );
};

export default TradingViewChart;
