import { PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { SolanaLiquidityPool } from "../idl/solana_liquidity_pool.types";

export const getCurrentRewardRate = async (
  program: Program<SolanaLiquidityPool>,
  poolAddress: PublicKey,
  isPoolInitialized: boolean
) => {
  if (!isPoolInitialized) {
    return {
      rewardRate: "0",
      rewardRateFormatted: "0",
      rewardsDuration: "0",
      isRewardsActive: false,
    };
  }

  try {
    const poolState = await program.account.poolState.fetch(poolAddress);
    const currentTime = Math.floor(Date.now() / 1000);

    return {
      rewardRate: poolState.tokensPerInterval.toString(),
      rewardRateFormatted: (
        parseInt(poolState.tokensPerInterval.toString()) / 1e6
      ).toFixed(6),
      rewardsDuration: (
        poolState.rewardEndTime.toNumber() -
        poolState.rewardStartTime.toNumber()
      ).toString(),
      isRewardsActive: poolState.rewardEndTime.toNumber() > currentTime,
    };
  } catch (error) {
    console.error("Error fetching reward rate:", error);
    throw error;
  }
};
