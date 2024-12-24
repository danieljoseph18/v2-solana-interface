/**
 * Calculates the estimated liquidation price for a position
 * @param position The trading position
 * @returns The estimated liquidation price
 */
export const estimateLiquidationPrice = (position: Position): number => {
  const { size, margin, entryPrice, isLong } = position;

  // Calculate the percentage of price movement that would cause losses equal to margin
  const maxLossPercentage = margin / size;

  if (isLong) {
    // For longs, price needs to drop by maxLossPercentage
    return entryPrice * (1 - maxLossPercentage);
  } else {
    // For shorts, price needs to rise by maxLossPercentage
    return entryPrice * (1 + maxLossPercentage);
  }
};

export const preCalculateLiquidationPrice = (
  currentPrice: number,
  margin: number,
  size: number,
  isLong: boolean
): number => {
  const maxLossPercentage = margin / size;

  if (isLong) {
    return currentPrice * (1 - maxLossPercentage);
  } else {
    return currentPrice * (1 + maxLossPercentage);
  }
};
