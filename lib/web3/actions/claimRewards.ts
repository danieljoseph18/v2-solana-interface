import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { SolanaLiquidityPool } from "@/lib/web3/idl/solana_liquidity_pool.types";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const claimRewards = async (
  program: Program<SolanaLiquidityPool>,
  userPublicKey: PublicKey
): Promise<{ signature: string; claimedAmount: number }> => {
  try {
    // 1. Derive necessary PDAs and get token accounts
    const [poolState] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool-state")],
      program.programId
    );

    const [userState] = PublicKey.findProgramAddressSync(
      [Buffer.from("user-state"), userPublicKey.toBuffer()],
      program.programId
    );

    // Get pool data to find reward vault
    const poolData = await program.account.poolState.fetch(poolState);

    // Get user's USDC token account (where rewards will be sent)
    const userUsdcAccount = await getAssociatedTokenAddress(
      poolData.usdcVault, // USDC mint
      userPublicKey
    );

    // 2. Submit the transaction
    const tx = await program.methods
      .claimRewards()
      .accountsStrict({
        user: userPublicKey,
        poolState: poolState,
        userState: userState,
        usdcRewardVault: poolData.usdcRewardVault,
        userUsdcAccount: userUsdcAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    // 3. Get the updated user state to return claimed amount
    const updatedUserState = await program.account.userState.fetch(userState);
    const previousPending = (await program.account.userState.fetch(userState))
      .pendingRewards;
    const claimedAmount =
      (Number(previousPending) - Number(updatedUserState.pendingRewards)) /
      1_000_000; // Convert to human-readable USDC

    return {
      signature: tx,
      claimedAmount: claimedAmount,
    };
  } catch (error: any) {
    // Handle specific error cases
    if (error.message?.includes("No rewards to claim")) {
      throw new Error("No rewards available to claim");
    }
    if (error.message?.includes("RewardsEnded")) {
      throw new Error("Reward distribution period has ended");
    }
    console.error("Error claiming rewards:", error);
    throw error;
  }
};

// Example usage:
const claim = async (program: Program<SolanaLiquidityPool>, key: PublicKey) => {
  try {
    const result = await claimRewards(program, key);

    console.log(`Successfully claimed ${result.claimedAmount} USDC`);
    console.log(`Transaction signature: ${result.signature}`);
  } catch (error: any) {
    if (error.message === "No rewards available to claim") {
      console.log("You don't have any rewards to claim at this time.");
    } else {
      console.error("Failed to claim rewards:", error);
    }
  }
};
