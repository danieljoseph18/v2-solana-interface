interface Asset {
  customId: string;
  symbol: string;
  fullName: string;
  leverage: number;
  price?: number;
  change?: number;
  high24h?: number;
  low24h?: number;
  image: string;
  categories: string[];
  priceDecimals?: number;
  apy: number;
  trustScore: number;
  isVerified: boolean;
  marketId: `0x${string}`;
  xpMultiplier: number;
  totalLongDeposits: number;
  totalShortDeposits: number;
  liquidity: number;
  networks: {
    [network: string]: {
      tokenAddress: `0x${string}`;
      poolAddress: `0x${string}`;
    };
  };
  coingeckoId: string;
}

interface DatabaseAsset {
  name: string;
  ticker: string;
  categories: string[];
  is_verified: boolean;
  xp_multiplier: bigint;
}
