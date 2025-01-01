import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { getAccount } from "@solana/spl-token";
import { contractAddresses } from "../config";

export const getUserLpBalance = async (
  connection: Connection,
  userPublicKey: PublicKey
): Promise<number> => {
  try {
    const lpTokenMint = new PublicKey(contractAddresses.devnet.lpTokenMint);
    // Find the user's associated token account for LP tokens
    const userLPTokenAccount = await getAssociatedTokenAddress(
      lpTokenMint,
      userPublicKey
    );

    // Get the token account info
    const tokenAccount = await getAccount(connection, userLPTokenAccount);

    // Convert to human-readable format
    const formattedBalance = Number(tokenAccount.amount) / 1_000_000; // 6 decimals

    return formattedBalance;
  } catch (error) {
    console.error("Error fetching user LP token balance:", error);
    throw error;
  }
};
