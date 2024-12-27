import {
  NATIVE_MINT,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { SignerWalletAdapter } from "@solana/wallet-adapter-base";
import { Transaction, PublicKey, Connection } from "@solana/web3.js";

export const getOrCreateWrappedSolAccount = async (
  wallet: PublicKey,
  connection: Connection,
  sendTransaction: SignerWalletAdapter["sendTransaction"]
): Promise<PublicKey> => {
  try {
    // Find the ATA address for wrapped SOL
    const associatedTokenAddress = await getAssociatedTokenAddress(
      NATIVE_MINT,
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
        associatedTokenAddress, // associatedTokenAddress
        wallet, // owner
        NATIVE_MINT // mint
      );

      transaction.add(createAtaIx);

      // Send and confirm transaction
      const signature = await sendTransaction(transaction, connection);
      console.log("Created wrapped SOL ATA:", signature);

      return associatedTokenAddress;
    }
  } catch (error) {
    console.error("Error with wrapped SOL account:", error);
    throw error;
  }
};
