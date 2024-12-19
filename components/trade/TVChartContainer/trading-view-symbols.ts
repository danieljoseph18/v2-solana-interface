/**
 * @dev - Some symbols are stored differently in TradingView than in our DB. This mapping is used to get the correct symbol for TradingView charts.
 */
const symbolMapping: { [key: string]: string } = {
  TON: "TONCOIN",
  TURBO: "TURBOT",
};

/**
 * @dev - This function returns the correct symbol for TradingView charts.
 * If the symbol exists in the mapping, it returns the mapped value.
 * Otherwise, it returns the original symbol.
 */
export const getChartSymbol = (asset: Asset): string => {
  return symbolMapping[asset.symbol] || asset.symbol;
};
