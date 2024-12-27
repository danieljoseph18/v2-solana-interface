import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { SignerWalletAdapter } from "@solana/wallet-adapter-base";
import { Transaction, PublicKey, Connection } from "@solana/web3.js";
import { contractAddresses } from "../config";

export const getOrCreateCustomSolAccount = async (
  wallet: PublicKey,
  connection: Connection,
  sendTransaction: SignerWalletAdapter["sendTransaction"]
): Promise<PublicKey> => {
  console.log("Inside get or create custom sol account");
  try {
    // Use your custom SOL mint instead of NATIVE_MINT
    const customSolMint = new PublicKey(contractAddresses.devnet.solMint);

    // Find the ATA address for custom SOL token
    const associatedTokenAddress = await getAssociatedTokenAddress(
      customSolMint,
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
        customSolMint // mint
      );

      transaction.add(createAtaIx);

      // Send and confirm transaction
      const signature = await sendTransaction(transaction, connection);
      console.log("Created custom SOL token account:", signature);

      return associatedTokenAddress;
    }
  } catch (error) {
    console.error("Error with custom SOL token account:", error);
    throw error;
  }
};
