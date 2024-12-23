enum MarketStatus {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  CLOSED = "CLOSED",
}

interface Asset {
  id: string;
  symbol: string;
  tokenAddress: string;
  poolAddress: string;
  maxLeverage: number;
  maintainanceMargin: number;
  takerFee: number;
  makerFee: number;
  status: MarketStatus;
  fundingRate: number;
  lastPrice?: number;
  volume24h?: number;
  openInterest?: number;
}
