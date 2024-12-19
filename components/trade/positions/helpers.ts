export const getLiqPrice = (position: any) => {
  return position.liqPrice;
};

export const getClosedPositionProfitLoss = (position: ClosedPosition) => {
  const pnlPercentage = (position.realizedPnl / position.collateral) * 100;
  return {
    pnlUsd: `$${position.realizedPnl.toFixed(2)}`,
    pnlPercentage: `${pnlPercentage.toFixed(2)}%`,
    hasProfit: position.realizedPnl >= 0,
  };
};

export const getProfitLoss = (
  markPrice: number,
  position: any
): {
  pnlUsd: string;
  pnlPercentage: string;
  hasProfit: boolean;
} => {
  if (!position.entryPrice || !position.collateral) {
    return { pnlUsd: "0.00", pnlPercentage: "0.00", hasProfit: false };
  }

  let pnlUsd;
  let hasProfit;

  // Calculate PNL in USD
  if (position.isLong) {
    pnlUsd =
      (position.size * (markPrice - position.entryPrice)) / position.entryPrice;
  } else {
    pnlUsd =
      (position.size * (position.entryPrice - markPrice)) / position.entryPrice;
  }

  // Calculate percentage relative to collateral
  const percentage = (pnlUsd / position.collateral) * 100;
  hasProfit = pnlUsd >= 0;

  const percentageString = `${percentage.toFixed(2)}%`;
  const pnlString = hasProfit
    ? `+$${pnlUsd.toFixed(2)}`
    : `-$${Math.abs(pnlUsd).toFixed(2)}`;

  return {
    pnlUsd: pnlString,
    pnlPercentage: percentageString,
    hasProfit,
  };
};
