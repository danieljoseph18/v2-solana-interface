// hooks/useWallet.ts
import {
  useWallet as useSolanaWallet,
  useConnection as useSolanaConnection,
} from "@solana/wallet-adapter-react";
import { useCallback, useMemo, useEffect, useState, useRef } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  VersionedTransaction,
  SendOptions,
} from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { helperToast } from "@/lib/helperToast";
import { WalletName } from "@solana/wallet-adapter-base";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { idl } from "@/lib/web3/idl/solana_liquidity_pool";
import { SolanaLiquidityPool } from "@/lib/web3/idl/solana_liquidity_pool.types";
import { getBalance } from "@/app/actions/margin";
import { getTokenMint } from "@/lib/web3/config";

interface SendTransactionProps {
  to: string;
  value: string;
  token: TokenType;
}

interface Balances {
  solBalance: number;
  usdcBalance: number;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

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

    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error);
    helperToast.error("Failed to register user");
    throw error;
  }
};

export function useWallet() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [balances, setBalances] = useState<Balances>({
    solBalance: 0,
    usdcBalance: 0,
  });
  const eventSourceRef = useRef<EventSource | null>(null);

  const {
    connected,
    publicKey,
    signTransaction,
    signAllTransactions,
    disconnect,
    select,
    wallet,
    wallets,
    connecting,
  } = useSolanaWallet();

  const { connection } = useSolanaConnection();

  const address = useMemo(() => {
    return publicKey?.toBase58() || null;
  }, [publicKey]);

  // Create Anchor Provider
  const anchorProvider = useMemo(() => {
    if (!publicKey || !signTransaction || !signAllTransactions) return null;

    return new AnchorProvider(
      connection,
      {
        publicKey,
        signTransaction,
        signAllTransactions,
      },
      {
        commitment: "confirmed",
        preflightCommitment: "confirmed",
      }
    );
  }, [connection, publicKey, signTransaction, signAllTransactions]);

  // Create Program instance
  const program = useMemo(() => {
    if (!anchorProvider) return null;
    try {
      // The correct order is (idl, programId, provider)
      return new Program<SolanaLiquidityPool>(
        idl as SolanaLiquidityPool,
        anchorProvider
      );
    } catch (error) {
      console.error("Failed to create program instance:", error);
      return null;
    }
  }, [anchorProvider]);

  useEffect(() => {
    let isSubscribed = true;

    const initializeUser = async () => {
      // Only proceed if we have a connection and haven't registered yet
      if (connected && address && !isRegistered) {
        try {
          await registerUser(address);
          if (isSubscribed) {
            setIsRegistered(true);
          }
        } catch (error) {
          // Error is already logged in registerUser
          if (isSubscribed) {
            setIsRegistered(false);
          }
        }
      }
    };

    initializeUser();

    // Cleanup function
    return () => {
      isSubscribed = false;
    };
  }, [connected, address, isRegistered]);

  // Reset registration state when wallet disconnects
  useEffect(() => {
    if (!connected) {
      setIsRegistered(false);
    }
  }, [connected]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) return;
      const [solBalance, usdcBalance] = await Promise.all([
        getBalance(address, "SOL"),
        getBalance(address, "USDC"),
      ]);
      setBalances({ solBalance, usdcBalance });
    };
    fetchBalances();
  }, [address]);

  // Add SSE listener setup
  useEffect(() => {
    if (!address || !BACKEND_URL) return;

    // Clean up any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Create new EventSource connection for balances
    const eventSource = new EventSource(
      `${BACKEND_URL}/events/balances?userId=${address}`
    );
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as {
          userId: string;
          timestamp: string;
        };
        // When we receive an update, refresh the balances
        if (data.userId === address) {
          getBalance(address, "SOL").then((solBalance) =>
            getBalance(address, "USDC").then((usdcBalance) =>
              setBalances({ solBalance, usdcBalance })
            )
          );
        }
      } catch (error) {
        console.error("Error processing SSE message:", error);
      }
    };

    // Cleanup function
    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [address]);

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
          const mintAddress = getTokenMint(token);
          if (!mintAddress) {
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

          // Check if destination token account exists
          const toAccountInfo = await connection.getAccountInfo(toTokenAccount);

          // Create transaction
          transaction = new Transaction();

          // If destination token account doesn't exist, create it
          if (!toAccountInfo) {
            transaction.add(
              createAssociatedTokenAccountInstruction(
                new PublicKey(address), // payer
                toTokenAccount, // associated token account
                new PublicKey(to), // owner
                mint // mint
              )
            );
          }

          // Add transfer instruction
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

  const handleRegularTransaction = useCallback(
    async (
      transaction: Transaction | VersionedTransaction,
      connection: Connection,
      options?: SendOptions
    ): Promise<string> => {
      try {
        if (!publicKey || !signTransaction) {
          throw new Error("Wallet not connected");
        }

        // Get recent blockhash and set it on the transaction
        const latestBlockhash = await connection.getLatestBlockhash();
        if (transaction instanceof Transaction) {
          transaction.recentBlockhash = latestBlockhash.blockhash;
          transaction.feePayer = publicKey;
        }

        // Sign transaction
        const signedTx = await signTransaction(transaction);

        // Send raw transaction
        const signature = await connection.sendRawTransaction(
          signedTx.serialize(),
          options
        );

        // Confirm transaction
        await connection.confirmTransaction({
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        });

        return signature;
      } catch (error) {
        console.error("Transaction failed:", error);
        throw error;
      }
    },
    [publicKey, signTransaction]
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
    sendRegularTransaction: handleRegularTransaction,
    availableWallets: wallets,
    selectedWallet: wallet,
    connection,
    program,
    provider: anchorProvider,
    signTransaction,
    balances,
  };
}
