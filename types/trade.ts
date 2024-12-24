enum OrderSide {
  LONG = "LONG",
  SHORT = "SHORT",
}

interface LimitOrderRequest extends OrderRequest {
  price: string;
  type: OrderType;
}

interface OrderRequest {
  id?: string;
  userId: string;
  marketId: string;
  side: OrderSide;
  size: string;
  leverage: string;
  token: TokenType;
  stopLossPrice?: string;
  takeProfitPrice?: string;
}

enum OrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT",
  STOP_MARKET = "STOP_MARKET",
  TAKE_PROFIT_MARKET = "TAKE_PROFIT_MARKET",
}
