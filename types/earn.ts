import { COLLATERAL_OPTIONS } from "@/lib/constants";

export type TabType = "deposit" | "withdraw";

export type CollateralType = (typeof COLLATERAL_OPTIONS)[number];

export interface EntryProps {
  isDeposit: boolean;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  collateralType: CollateralType;
  setCollateralType: (collateral: CollateralType) => void;
  amount: string;
  setAmount: (amount: string) => void;
  prices: {
    solPrice: number;
    usdcPrice: number;
  };
  balancesUsd: {
    solBalanceUsd: number;
    usdcBalanceUsd: number;
  };
  lpTokenPrice: number;
  lpBalance: number;
  refetchBalances?: () => void;
}
