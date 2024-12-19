import { COLLATERAL_OPTIONS } from "@/lib/constants";

export type TabType = "deposit" | "withdraw";

export type CollateralType = (typeof COLLATERAL_OPTIONS)[number];
