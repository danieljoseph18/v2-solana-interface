import { createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { contractAddresses, getCurrentNetwork } from "../config";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { SignerWalletAdapter } from "@solana/wallet-adapter-base";

export const getOrCreateUsdcAccount = async (
  wallet: PublicKey,
  connection: Connection,
  sendTransaction: SignerWalletAdapter["sendTransaction"]
): Promise<PublicKey> => {
  const network = getCurrentNetwork();

  const usdcMint = new PublicKey(contractAddresses[network].usdcMint);

  try {
    // Find the ATA address for USDC
    const associatedTokenAddress = await getAssociatedTokenAddress(
      usdcMint,
      wallet
    );

    try {
      // Check if account exists
      await connection.getTokenAccountBalance(associatedTokenAddress);
      return associatedTokenAddress;
    } catch {
      // If account doesn't exist, create it
      const transaction = new Transaction();

      // Create ATA instruction
      const createAtaIx = createAssociatedTokenAccountInstruction(
        wallet, // payer
        associatedTokenAddress, // ata
        wallet, // owner
        usdcMint // mint
      );

      transaction.add(createAtaIx);

      // Send and confirm transaction
      const signature = await sendTransaction(transaction, connection);

      return associatedTokenAddress;
    }
  } catch (error) {
    console.error("Error with USDC account:", error);
    throw error;
  }
};
