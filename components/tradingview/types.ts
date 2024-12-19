import {
  LibrarySymbolInfo,
  Bar as BarType,
} from "@/public/static/charting_library/charting_library";

export type Bar = BarType & {
  ticker?: string;
};

export type SymbolInfo = LibrarySymbolInfo & {
  isStable: boolean;
  isCentralized: boolean;
  score: number;
  symbol: string;
  ticker: string;
  name: string;
  description: string;
  exchange: string;
  type: string;
};
