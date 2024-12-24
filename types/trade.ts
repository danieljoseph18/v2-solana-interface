enum OrderSide {
  LONG = "LONG",
  SHORT = "SHORT",
}

enum MarginType {
  ISOLATED = "ISOLATED",
  CROSS = "CROSS",
}

interface LimitOrderRequest extends OrderRequest {
  price: string;
  token: TokenType;
  type: OrderType;
}

interface OrderRequest {
  id?: string;
  userId: string;
  marketId: string;
  side: OrderSide;
  size: string;
  leverage: string;
  marginType?: MarginType;
  stopLossPrice?: string;
  takeProfitPrice?: string;
}

enum OrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT",
  STOP_MARKET = "STOP_MARKET",
  TAKE_PROFIT_MARKET = "TAKE_PROFIT_MARKET",
}
