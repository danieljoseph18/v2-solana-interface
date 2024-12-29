import { PublicKey } from "@solana/web3.js";
import { Program, BN } from "@coral-xyz/anchor";
import { SolanaLiquidityPool } from "../idl/solana_liquidity_pool.types";

export const getLpTokenPrice = async (
  program: Program<SolanaLiquidityPool>,
  poolStateAddress: PublicKey
): Promise<number> => {
  try {
    // 1. Fetch pool state data
    const poolState = await program.account.poolState.fetch(poolStateAddress);

    // 2. Get LP token supply
    const lpMintInfo = await program.provider.connection.getTokenSupply(
      poolState.lpTokenMint
    );
    const lpSupply = Number(lpMintInfo.value.amount);

    // If no LP tokens exist yet, return 1 USD as initial price
    if (lpSupply === 0) {
      return 1;
    }

    // 3. Calculate total value in USD (6 decimals)
    // Convert SOL amount (9 decimals) to USD (6 decimals)
    const solUsdPrice = new BN(poolState.solUsdPrice.toString());
    const solAmount = new BN(poolState.solDeposited.toString());

    // Same calculation as in your Rust code:
    // (sol_amount * sol_usd_price) / 10^8 / 1000
    const solValueUsd = solAmount
      .mul(solUsdPrice)
      .div(new BN(100_000_000)) // Remove Chainlink's 8 decimals
      .div(new BN(1000)); // Convert from 9 to 6 decimals

    // Add USDC value (already in 6 decimals)
    const usdcAmount = new BN(poolState.usdcDeposited.toString());
    const totalValueUsd = solValueUsd.add(usdcAmount);

    // 4. Calculate price: totalValueUsd / lpSupply (both in 6 decimals)
    const priceUsd = Number(totalValueUsd.toString()) / Number(lpSupply);

    return priceUsd;
  } catch (error) {
    console.error("Error calculating LP token price:", error);
    throw error;
  }
};

// Example usage:
const getLpInfo = async (program: Program<SolanaLiquidityPool>) => {
  try {
    const price = await getLpTokenPrice(
      program,
      new PublicKey("your_pool_state_address")
    );

    console.log(`LP Token Price: $${price.toFixed(6)}`);
  } catch (error) {
    console.error("Failed to get LP token price:", error);
  }
};
