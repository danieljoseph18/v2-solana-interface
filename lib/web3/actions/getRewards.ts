import { BN, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { SolanaLiquidityPool } from "../idl/solana_liquidity_pool.types";
import { getUserLpBalance } from "./getLpTokenBalance";
import { getLpTokenSupply } from "./getLpTokenSupply";

/**
 * Gets the total amount of rewards a user has earned all time
 * @param program The liquidity pool program instance
 * @param userAddress The public key of the user
 * @returns Total rewards earned in USDC (formatted to 6 decimal places)
 */
export const getAllTimeRewards = async (
  program: Program<SolanaLiquidityPool>,
  userAddress: PublicKey
): Promise<{
  totalRewardsFormatted: string; // Human readable (e.g., "1000.123456")
  totalRewardsRaw: string; // Raw amount with 6 decimals
}> => {
  try {
    // Get pool state PDA
    const [poolState] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool-state")],
      program.programId
    );

    // Get user state PDA
    const [userState] = PublicKey.findProgramAddressSync(
      [Buffer.from("user-state"), userAddress.toBuffer()],
      program.programId
    );

    // Fetch user state data
    const userStateAccount = await program.account.userState.fetch(userState);

    // Get pending rewards
    const pendingRewards = userStateAccount.pendingRewards;

    // Get total rewards claimed from pool state
    const poolStateAccount = await program.account.poolState.fetch(poolState);
    const totalRewardsClaimed = poolStateAccount.totalRewardsClaimed;

    // Sum pending and claimed rewards
    const totalRewards = pendingRewards.add(totalRewardsClaimed);

    return {
      totalRewardsFormatted: totalRewards.div(new BN(1_000_000)).toString(), // Convert from 6 decimals
      totalRewardsRaw: totalRewards.toString(),
    };
  } catch (error) {
    console.error("Error fetching all time rewards:", error);
    throw error;
  }
};

/**
 * Gets the current unclaimed rewards available for a user
 * @param program The liquidity pool program instance
 * @param userPublicKey The public key of the user
 * @returns Pending rewards in USDC (formatted to 6 decimal places)
 */
export const getClaimableRewards = async (
  program: Program<SolanaLiquidityPool>,
  userPublicKey: PublicKey
): Promise<{
  claimableAmount: BN;
  formattedAmount: string;
}> => {
  try {
    // Derive PDAs
    const [poolState] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool-state")],
      program.programId
    );

    const [userState] = PublicKey.findProgramAddressSync(
      [Buffer.from("user-state"), userPublicKey.toBuffer()],
      program.programId
    );

    // Fetch accounts
    const poolStateAccount = await program.account.poolState.fetch(poolState);
    const userStateAccount = await program.account.userState.fetch(userState);
    const lpTokenMint = await program.provider.connection.getTokenSupply(
      poolStateAccount.lpTokenMint
    );

    // Constants
    const PRECISION = new BN("1000000000000"); // Same as Rust's 1_000_000_000_000
    const now = new BN(Math.floor(Date.now() / 1000));

    // If no LP tokens exist, no rewards to calculate
    if (lpTokenMint.value.uiAmount === 0) {
      return {
        claimableAmount: new BN(0),
        formattedAmount: "0.000000",
      };
    }

    // Calculate time difference since last distribution
    const timeDiff = now.sub(new BN(poolStateAccount.lastDistributionTime));

    let newCumulativeRewardPerToken = new BN(
      poolStateAccount.cumulativeRewardPerToken
    );

    if (timeDiff.gt(new BN(0))) {
      // Calculate pending rewards
      const pendingRewards = new BN(poolStateAccount.tokensPerInterval).mul(
        timeDiff
      );

      // Calculate reward per token
      const rewardPerToken = pendingRewards
        .mul(PRECISION)
        .div(new BN(lpTokenMint.value.amount));

      // Add to cumulative
      newCumulativeRewardPerToken =
        newCumulativeRewardPerToken.add(rewardPerToken);
    }

    // Calculate user's new rewards
    const userReward = new BN(userStateAccount.lpTokenBalance)
      .mul(
        newCumulativeRewardPerToken.sub(
          new BN(userStateAccount.previousCumulatedRewardPerToken)
        )
      )
      .div(PRECISION);

    // Add existing pending rewards
    const totalPendingRewards = userReward.add(
      new BN(userStateAccount.pendingRewards)
    );

    // Check against available rewards in pool
    const availableInPool = new BN(poolStateAccount.totalRewardsDeposited).sub(
      new BN(poolStateAccount.totalRewardsClaimed)
    );

    // Claimable is minimum of pending and available
    const claimableAmount = BN.min(totalPendingRewards, availableInPool);

    // Format with 6 decimals (USDC standard)
    const formattedAmount = (claimableAmount.toNumber() / 1_000000).toFixed(6);

    return {
      claimableAmount,
      formattedAmount,
    };
  } catch (error) {
    console.error("Error calculating claimable rewards:", error);
    throw error;
  }
};
