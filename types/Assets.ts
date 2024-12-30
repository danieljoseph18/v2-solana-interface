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
  borrowingRate: number;
  fundingRate: number;
  fundingRateVelocity: number;
  lastUpdatedTimestamp: number;
  longOpenInterest: number;
  shortOpenInterest: number;
  availableLiquidity: number;
  volume24h: number;
  lastPrice: number;
}
