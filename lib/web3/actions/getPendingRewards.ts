import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { SolanaLiquidityPool } from "../idl/solana_liquidity_pool.types";

export const getPendingRewards = async (
  program: Program<SolanaLiquidityPool>,
  poolAddress: PublicKey,
  userAddress: PublicKey,
  isPoolInitialized: boolean
) => {
  if (!isPoolInitialized) {
    return {
      pendingRewards: "0",
      pendingRewardsFormatted: "0",
      lastUpdateTime: "0",
      rewardEndTime: "0",
    };
  }

  try {
    const poolState = await program.account.poolState.fetch(poolAddress);
    const [userStateAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("user-state"),
        poolAddress.toBuffer(),
        userAddress.toBuffer(),
      ],
      program.programId
    );

    const userState = await program.account.userState.fetch(userStateAccount);
    const currentTime = Math.floor(Date.now() / 1000);
    const endTime = Math.min(currentTime, poolState.rewardEndTime.toNumber());

    // Calculate pending rewards
    const timeElapsed = endTime - userState.lastClaimTimestamp.toNumber();
    const rewardsPerToken =
      poolState.tokensPerInterval.toNumber() * timeElapsed;
    const userRewards =
      (userState.lpTokenBalance.toNumber() * rewardsPerToken) / 1e6;
    const totalPendingRewards =
      userState.pendingRewards.toNumber() + userRewards;

    return {
      pendingRewards: totalPendingRewards.toString(),
      pendingRewardsFormatted: (totalPendingRewards / 1e6).toFixed(6),
      lastUpdateTime: userState.lastClaimTimestamp.toString(),
      rewardEndTime: poolState.rewardEndTime.toString(),
    };
  } catch (error) {
    console.error("Error calculating pending rewards:", error);
    throw error;
  }
};
