import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { SolanaLiquidityPool } from "../idl/solana_liquidity_pool.types";

export const getApr = async (
  program: Program<SolanaLiquidityPool>
): Promise<{
  apr: number;
  formattedApr: string;
  rewardRatePerSecond: number;
}> => {
  try {
    // Get pool state PDA
    const [poolState] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool-state")],
      program.programId
    );

    // Fetch pool state
    const poolStateAccount = await program.account.poolState.fetch(poolState);

    // Calculate TVL in USDC (6 decimals)
    const solUsdValue = new anchor.BN(poolStateAccount.solDeposited)
      .mul(new BN(poolStateAccount.solUsdPrice))
      .div(new BN(100000000)); // Adjust for Chainlink's 8 decimals to get to USDC's 6

    const tvlUsdc = solUsdValue.add(new BN(poolStateAccount.usdcDeposited));

    // Get reward rate per second (in USDC with 6 decimals)
    const rewardRatePerSecond = poolStateAccount.tokensPerInterval;

    // Calculate APR
    // Formula: (rewardRatePerSecond * seconds_in_year * 100) / tvlUsdc = APR%
    const SECONDS_IN_YEAR = 31536000;

    const apr = tvlUsdc.isZero()
      ? 0
      : (rewardRatePerSecond.toNumber() * SECONDS_IN_YEAR * 100) /
        tvlUsdc.toNumber();

    return {
      apr,
      formattedApr: `${apr.toFixed(2)}%`,
      rewardRatePerSecond: rewardRatePerSecond.toNumber() / 1_000000, // Convert to human-readable USDC/second
    };
  } catch (error) {
    console.error("Error calculating APR:", error);
    throw error;
  }
};
