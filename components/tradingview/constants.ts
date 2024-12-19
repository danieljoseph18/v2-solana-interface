interface SupportedResolutions {
  [key: string]: string;
}

export const SUPPORTED_RESOLUTIONS: SupportedResolutions = {
  1: "1m",
  5: "5m",
  15: "15m",
  60: "1h",
  240: "4h",
  "1D": "1d",
};
export const LAST_BAR_REFRESH_INTERVAL = 15000; // 15 seconds
export const TV_CHART_RELOAD_INTERVAL = 15 * 60 * 1000; // 15 minutes
export const timezoneOffset = -new Date().getTimezoneOffset() * 60;
export const USD_DECIMALS = 30;

interface ChartPeriods {
  [key: string]: number;
}

export const CHART_PERIODS: ChartPeriods = {
  "1m": 60,
  "5m": 60 * 5,
  "15m": 60 * 15,
  "1h": 60 * 60,
  "4h": 60 * 60 * 4,
  "1d": 60 * 60 * 24,
};

export const PERIOD_MAPPING: { [key: string]: string } = {
  "1": "minute",
  "5": "minute",
  "15": "minute",
  "60": "hour",
  "240": "hour",
  "1D": "day",
};

export const resolutionMapping: any = {
  "1": { endpoint: "histominute", aggregate: 1 },
  "5": { endpoint: "histominute", aggregate: 5 },
  "15": { endpoint: "histominute", aggregate: 15 },
  "30": { endpoint: "histominute", aggregate: 30 },
  "60": { endpoint: "histohour", aggregate: 1 },
  "240": { endpoint: "histohour", aggregate: 4 },
  "1D": { endpoint: "histoday", aggregate: 1 },
  "1W": { endpoint: "histoday", aggregate: 7 },
  "1M": { endpoint: "histoday", aggregate: 30 },
};
