import { formatTVDate, formatTVTime } from "@/lib/utils/dates";
import {
  LanguageCode,
  ResolutionString,
  ThemeName,
  TradingTerminalFeatureset,
} from "@/public/static/charting_library/charting_library";

export const disabledFeatures: TradingTerminalFeatureset[] = [
  "header_compare",
  "header_symbol_search",
  "symbol_search_hot_key",
  "timeframes_toolbar",
  "show_symbol_logo_in_legend",
  "symbol_info",
  "header_settings",
  "header_screenshot",
  "volume_force_overlay",
  "save_chart_properties_to_local_storage",
  "create_volume_indicator_by_default",
  "support_multicharts",
  "header_layouttoggle",
  "chart_crosshair_menu",
  "add_to_watchlist",
  "open_account_manager",
  "trading_notifications",
  "multiple_watchlists",
  "show_trading_notifications_history",
];

export const enabled_features: TradingTerminalFeatureset[] = [];

export const intervals: ResolutionString[] = [
  "1",
  "5",
  "15",
  "60",
  "240",
  "1D",
] as ResolutionString[];

export const locale: LanguageCode = "en";

export const chartStyleOverrides = [
  "candleStyle",
  "hollowCandleStyle",
  "haStyle",
].reduce<Record<string, boolean | string>>((acc, cv) => {
  acc[`mainSeriesProperties.${cv}.drawWick`] = true;
  acc[`mainSeriesProperties.${cv}.drawBorder`] = false;
  acc[`mainSeriesProperties.${cv}.upColor`] = "#30E0A1";
  acc[`mainSeriesProperties.${cv}.downColor`] = "#FA2256";
  acc[`mainSeriesProperties.${cv}.wickUpColor`] = "#30E0A1";
  acc[`mainSeriesProperties.${cv}.wickDownColor`] = "#FA2256";
  acc[`mainSeriesProperties.${cv}.borderUpColor`] = "#30E0A1";
  acc[`mainSeriesProperties.${cv}.borderDownColor`] = "#FA2256";
  return acc;
}, {});

export const theme: ThemeName = "dark";

export const chartOverrides = {
  "paneProperties.background": "#101014",
  "paneProperties.backgroundType": "solid",
  "paneProperties.vertGridProperties.color": "rgba(35, 38, 59, 1)",
  "paneProperties.vertGridProperties.style": 0,
  "paneProperties.horzGridProperties.color": "rgba(35, 38, 59, 1)",
  "paneProperties.horzGridProperties.style": 0,
  "mainSeriesProperties.priceLineColor": "#3a3e5e",
  "scalesProperties.textColor": "#ADB1B8",
  "scalesProperties.lineColor": "#000000",
  "mainSeriesProperties.areaStyle.linestyle": 0,
  ...chartStyleOverrides,
};

export const defaultWidgetOptions = {
  debug: true,
  theme: theme,
  library_path: "/static/charting_library/",
  locale: locale,
  loading_screen: {
    backgroundColor: "#101014",
    foregroundColor: "#101014",
  },
  enabled_features: enabled_features,
  client_id: "tradingview.com",
  user_id: "public_user_id",
  fullscreen: false,
  autosize: false,
  height: 550,
  width: "100%",
  custom_css_url: "/static/tradingview-chart.css",
  overrides: chartOverrides,
  favorites: {
    intervals: intervals,
  },
  custom_formatters: {
    timeFormatter: {
      format: (date: Date) => formatTVTime(date),
      formatLocal: (date: Date) => formatTVTime(date),
      parse: (date: string) => new Date(date).toISOString(),
    },
    dateFormatter: {
      format: (date: Date) => formatTVDate(date),
      formatLocal: (date: Date) => formatTVDate(date),
      parse: (date: string) => new Date(date).toISOString(),
    },
  },
};
