import { createAssociatedTokenAccountInstruction } from "@solana/spl-token";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { contractAddresses } from "../config";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { AnchorProvider } from "@coral-xyz/anchor";
import { SignerWalletAdapter } from "@solana/wallet-adapter-base";

// USDC mint addresses
const USDC_MINT = new PublicKey(contractAddresses.devnet.usdcMint);

export const getOrCreateUsdcAccount = async (
  wallet: PublicKey,
  connection: Connection,
  sendTransaction: SignerWalletAdapter["sendTransaction"]
): Promise<PublicKey> => {
  try {
    // Find the ATA address for USDC
    const associatedTokenAddress = await getAssociatedTokenAddress(
      USDC_MINT,
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
        USDC_MINT // mint
      );

      transaction.add(createAtaIx);

      // Send and confirm transaction
      const signature = await sendTransaction(transaction, connection);
      console.log("Created USDC ATA:", signature);

      return associatedTokenAddress;
    }
  } catch (error) {
    console.error("Error with USDC account:", error);
    throw error;
  }
};
