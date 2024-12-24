interface Position {
  positionId: string;
  userAddress: string;
  symbol: string;
  marketId: string;
  isLong: boolean;
  size: number;
  leverage: number;
  entryPrice: number;
  stopLossPrice?: number;
  takeProfitPrice?: number;
  trailingStopDistance?: number;
  status: "OPEN" | "CLOSED" | "LIQUIDATED";
  closingPrice?: number;
  margin: number;
  lockedMarginSOL: number;
  lockedMarginUSDC: number;
  realizedPnl?: number;
  accumulatedFunding: number;
  accumulatedBorrowingFee: number;
  lastBorrowingFeeUpdate: string;
  createdAt: string;
  updatedAt: string;
}

interface PositionReturnType {
  id: string; // positionId
  userId: string; // publicKey of user
  symbol: string;
  marketId: string;
  side: "LONG" | "SHORT";
  size: string;
  entryPrice: string;
  leverage: string;
  stopLossPrice?: string;
  takeProfitPrice?: string;
  trailingStopDistance?: string;
  margin: string;
  lockedMarginSOL: string;
  lockedMarginUSDC: string;
  realizedPnl?: string;
  status: "OPEN" | "CLOSED" | "LIQUIDATED";
  closingPrice?: string;
  closedAt?: string;
  accumulatedFunding: string;
  accumulatedBorrowingFee: string;
  lastBorrowingFeeUpdate: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  orderId: string;
  userAddress: string;
  marketId: string;
  symbol: string;
  isLong: boolean;
  size: number;
  triggerPrice: number;
  leverage: number;
  marginToken: "SOL" | "USDC";
  requiredMargin: number;
  status: "OPEN" | "FILLED" | "CANCELLED";
  orderType: "Limit" | "Stop Loss" | "Take Profit";
  createdAt: string;
  updatedAt: string;
}

interface OrderReturnType {
  id: string;
  userId: string;
  marketId: string;
  symbol: string;
  side: "LONG" | "SHORT";
  size: string;
  price: string;
  leverage: string;
  token: "SOL" | "USDC";
  requiredMargin: string;
  status: "OPEN" | "FILLED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}
