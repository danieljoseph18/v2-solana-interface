import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

async function getOrCreateAssociatedTokenAccount(
  connection: Connection,
  payer: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<PublicKey> {
  try {
    // Get the associated token account address
    const ata = getAssociatedTokenAddressSync(mint, owner);

    // Check if the account exists
    const account = await connection.getAccountInfo(ata);

    // If account doesn't exist, create it
    if (!account) {
      const transaction = new Transaction();
      transaction.add(
        createAssociatedTokenAccountInstruction(payer, ata, owner, mint)
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = payer;

      // Sign and send transaction
      const signedTx = await signTransaction(transaction);
      const txHash = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(txHash);
    }

    return ata;
  } catch (error) {
    console.error("Error creating token account:", error);
    throw error;
  }
}

export default getOrCreateAssociatedTokenAccount;
