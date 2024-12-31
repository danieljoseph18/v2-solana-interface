import { Connection, PublicKey } from "@solana/web3.js";
import { getTokenMint, getRpcUrl } from "../config";
import { AccountLayout } from "@solana/spl-token";

export const getUserBalances = async (
  connection: Connection,
  walletAddress: PublicKey
) => {
  try {
    // Get SOL balance
    const solBalance = await connection.getBalance(walletAddress);

    // Get USDC token account
    const usdcMint = new PublicKey(getTokenMint("USDC"));

    const tokenAccounts = await connection.getTokenAccountsByOwner(
      walletAddress,
      {
        mint: usdcMint,
      }
    );

    // Sum up USDC balance across all token accounts
    let usdcBalance = 0;
    tokenAccounts.value.forEach((tokenAccount) => {
      const accountInfo = AccountLayout.decode(tokenAccount.account.data);
      usdcBalance += Number(accountInfo.amount);
    });

    return {
      solBalance: (solBalance / 1e9).toString(), // Convert lamports to SOL
      usdcBalance: (usdcBalance / 1e6).toString(), // Convert to USDC (6 decimals)
      solFormatted: (solBalance / 1e9).toFixed(4),
      usdcFormatted: (usdcBalance / 1e6).toFixed(2),
    };
  } catch (error) {
    console.error("Error fetching balances:", error);
    return {
      solBalance: "0",
      usdcBalance: "0",
      solFormatted: "0.0000",
      usdcFormatted: "0.00",
    };
  }
};
