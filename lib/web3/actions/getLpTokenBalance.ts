import { PublicKey } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { SolanaLiquidityPool } from "../idl/solana_liquidity_pool.types";

export const getUserLpBalance = async (
  program: Program<SolanaLiquidityPool>,
  userPublicKey: PublicKey
): Promise<number> => {
  try {
    // Derive the user's PDA (same as in your contract)
    const [userStateAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("user-state"), userPublicKey.toBuffer()],
      program.programId
    );

    // Fetch the user's state account
    const userState = await program.account.userState.fetch(userStateAddress);

    return Number(userState.lpTokenBalance);
  } catch (error: any) {
    if (error.message?.includes("Account does not exist")) {
      // Return zero balances for new users
      return 0;
    }
    console.error("Error fetching LP token balance:", error);
    throw error;
  }
};

// Example usage:
const getLpBalance = async (
  program: Program<SolanaLiquidityPool>,
  userPublicKey: PublicKey
) => {
  try {
    const balance = await getUserLpBalance(program, userPublicKey);

    console.log("LP Token Balance:", balance);
  } catch (error) {
    console.error("Failed to get LP balance:", error);
  }
};
