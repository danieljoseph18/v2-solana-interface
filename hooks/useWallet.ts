// hooks/useWallet.ts
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useCallback, useMemo, useEffect } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { helperToast } from "@/lib/helperToast";
import { WalletName } from "@solana/wallet-adapter-base";

interface SendTransactionProps {
  to: string;
  value: string;
  token: TokenType;
}

const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const connection = new Connection(SOLANA_RPC_URL);

const TOKEN_MINTS: { [key in TokenType]: string } = {
  SOL: "native",
  USDC: process.env.NEXT_PUBLIC_USDC_MINT!,
};

const registerUser = async (publicKey: string) => {
  try {
    if (!BACKEND_URL) {
      throw new Error("Backend URL not configured");
    }

    const response = await fetch(`${BACKEND_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicKey }),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }
  } catch (error) {
    console.error("Error registering user:", error);
    helperToast.error("Failed to register user");
  }
};

export function useWallet() {
  const {
    connected,
    publicKey,
    signTransaction,
    disconnect,
    select,
    wallet,
    wallets,
    connecting,
  } = useSolanaWallet();

  const address = useMemo(() => {
    return publicKey?.toBase58() || null;
  }, [publicKey]);

  useEffect(() => {
    if (connected && address) {
      registerUser(address);
    }
  }, [connected, address]);

  const handleSendTransaction = useCallback(
    async ({ to, value, token }: SendTransactionProps): Promise<string> => {
      try {
        if (!address || !signTransaction) {
          throw new Error("Wallet not connected");
        }

        // Convert value to lamports/token base units
        const amount =
          token === "SOL"
            ? Math.floor(parseFloat(value) * 1e9) // SOL has 9 decimals
            : Math.floor(parseFloat(value) * 1e6); // USDC has 6 decimals

        let transaction = new Transaction();

        if (token === "SOL") {
          // Native SOL transfer
          transaction.add(
            SystemProgram.transfer({
              fromPubkey: new PublicKey(address),
              toPubkey: new PublicKey(to),
              lamports: amount,
            })
          );
        } else {
          // SPL Token transfer
          const mintAddress = TOKEN_MINTS[token];
          if (!mintAddress || mintAddress === "native") {
            throw new Error("Invalid token mint address");
          }

          const mint = new PublicKey(mintAddress);
          const fromTokenAccount = await getAssociatedTokenAddress(
            mint,
            new PublicKey(address)
          );
          const toTokenAccount = await getAssociatedTokenAddress(
            mint,
            new PublicKey(to)
          );

          transaction.add(
            createTransferInstruction(
              fromTokenAccount,
              toTokenAccount,
              new PublicKey(address),
              amount
            )
          );
        }

        // Get recent blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = new PublicKey(address);

        // Sign and send transaction
        const signedTx = await signTransaction(transaction);
        const txHash = await connection.sendRawTransaction(
          signedTx.serialize()
        );
        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          signature: txHash,
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        });

        return txHash;
      } catch (error) {
        console.error("Transaction failed:", error);
        helperToast.error(
          error instanceof Error ? error.message : "Transaction failed"
        );
        throw error;
      }
    },
    [address, signTransaction]
  );

  const connect = useCallback(
    (walletName?: WalletName) => {
      try {
        if (walletName) {
          // Connect to specific wallet

          select(walletName);
        } else if (wallet) {
          // Use existing wallet if already selected

          select(wallet.adapter.name);
        } else {
          console.error("No wallet specified");
          helperToast.error("Please select a wallet to connect");
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        helperToast.error("Failed to connect wallet");
        throw error;
      }
    },
    [wallet, select]
  );

  return {
    address,
    isConnected: connected,
    isConnecting: connecting,
    connect,
    disconnect,
    sendTransaction: handleSendTransaction,
    availableWallets: wallets,
    selectedWallet: wallet,
  };
}
