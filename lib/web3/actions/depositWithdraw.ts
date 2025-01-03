import { contractAddresses, getCurrentNetwork } from "@/lib/web3/config";
import { BN, Program } from "@coral-xyz/anchor";
import { createSyncNativeInstruction } from "@solana/spl-token";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { Transaction } from "@solana/web3.js";
import { getOrCreateCustomSolAccount } from "./getOrCreateCustomSolAccount";
import { getOrCreateUsdcAccount } from "./getOrCreateUsdcAccount";
import { SolanaLiquidityPool } from "../idl/solana_liquidity_pool.types";
import { SignerWalletAdapter } from "@solana/wallet-adapter-base";
import { divide, multiply } from "@/lib/utils/math";
import { helperToast } from "@/lib/helperToast";
import getOrCreateAssociatedTokenAccount from "./getOrCreateTokenAccount";

export const depositWithdraw = async (
  connection: Connection,
  publicKey: string,
  amount: string,
  program: Program<SolanaLiquidityPool>,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  sendRegularTransaction: SignerWalletAdapter["sendTransaction"],
  prices: {
    solPrice: number;
    usdcPrice: number;
  },
  collateralType: string,
  isDeposit: boolean,
  lpTokenPrice: number,
  setIsLoading: (isLoading: boolean) => void,
  refetchBalances?: () => void
) => {
  if (!publicKey || !amount || !program || !signTransaction || !prices) return;

  setIsLoading(true);

  try {
    const amountNative = isDeposit
      ? collateralType === "SOL"
        ? divide(amount, prices.solPrice)
        : divide(amount, prices.usdcPrice)
      : divide(amount, lpTokenPrice);

    const amountBaseUnits = Math.round(
      Number(
        isDeposit
          ? collateralType === "SOL"
            ? multiply(amountNative, 1e9)
            : multiply(amountNative, 1e6)
          : multiply(amountNative, 1e6)
      )
    );

    const userKey = new PublicKey(publicKey);
    const network = getCurrentNetwork();
    const poolAddress = new PublicKey(contractAddresses[network].poolStatePda);

    // Get pool state PDA
    const poolState = await program.account.poolState.fetch(poolAddress);

    // Only create token account if we're withdrawing
    const userTokenAccount = !isDeposit
      ? await getOrCreateAssociatedTokenAccount(
          connection,
          userKey,
          collateralType === "SOL"
            ? new PublicKey(contractAddresses[network].solMint)
            : new PublicKey(contractAddresses[network].usdcMint),
          userKey,
          signTransaction
        )
      : collateralType === "SOL"
      ? await getOrCreateCustomSolAccount(
          userKey,
          connection,
          sendRegularTransaction
        )
      : await getOrCreateUsdcAccount(
          userKey,
          connection,
          sendRegularTransaction
        );

    // If depositing SOL, wrap it first
    if (isDeposit && collateralType === "SOL") {
      const wrapSolTransaction = new Transaction();

      // Add instruction to transfer SOL to the wrapped SOL account
      wrapSolTransaction.add(
        SystemProgram.transfer({
          fromPubkey: userKey,
          toPubkey: userTokenAccount,
          lamports: amountBaseUnits,
        })
      );

      // Add instruction to sync native account
      wrapSolTransaction.add(createSyncNativeInstruction(userTokenAccount));

      // Send and confirm wrapping transaction
      const signature = await sendRegularTransaction(
        wrapSolTransaction,
        connection
      );
      await connection.confirmTransaction(signature, "confirmed");
    }

    // Declare userStateAccount before the try-catch block
    let userStateAccount: PublicKey;
    [userStateAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from("user-state"), new PublicKey(publicKey).toBuffer()],
      program.programId
    );

    console.log("User state account:", userStateAccount.toString());

    // Check if user state already exists
    try {
      const userState = await program.account.userState.fetch(userStateAccount);
      console.log("Existing user state found:", userState);
    } catch (error) {
      // If account doesn't exist, initialize it
      console.log("Initializing new user state...");
      const tx = await program.methods
        .initializeUser()
        .accountsStrict({
          user: userKey,
          userState: userStateAccount,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      await connection.confirmTransaction(tx, "confirmed");
      console.log("User state initialized successfully");
    }

    // Get LP token mint from pool state
    const lpTokenMint = poolState.lpTokenMint;

    const userLpTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      userKey,
      lpTokenMint,
      userKey,
      signTransaction
    );

    // Get vault account based on collateral type
    const vaultAccount = new PublicKey(
      collateralType === "SOL" ? poolState.solVault : poolState.usdcVault
    );

    if (isDeposit) {
      console.log("Attempting to deposit");
      const tx = await program.methods
        .deposit(new BN(amountBaseUnits))
        .accountsStrict({
          user: userKey,
          poolState: poolAddress,
          userTokenAccount: userTokenAccount,
          vaultAccount,
          userState: userStateAccount,
          lpTokenMint,
          userLpTokenAccount: userLpTokenAccount,
          chainlinkProgram: new PublicKey(
            contractAddresses[network].chainlinkProgram
          ),
          chainlinkFeed: new PublicKey(
            contractAddresses[network].chainlinkFeed
          ),
          tokenProgram: new PublicKey(contractAddresses[network].tokenProgram),
          systemProgram: new PublicKey(
            contractAddresses[network].systemProgram
          ),
        })
        .rpc();

      refetchBalances?.();

      helperToast.success("Deposit successful!");
    } else {
      const tx = await program.methods
        .withdraw(new BN(amountBaseUnits))
        .accountsStrict({
          user: userKey,
          poolState: poolAddress,
          userState: userStateAccount,
          lpTokenMint,
          userLpTokenAccount,
          vaultAccount,
          userTokenAccount,
          chainlinkProgram: new PublicKey(
            contractAddresses[network].chainlinkProgram
          ),
          chainlinkFeed: new PublicKey(
            contractAddresses[network].chainlinkFeed
          ),
          tokenProgram: new PublicKey(contractAddresses[network].tokenProgram),
        })
        .rpc();

      refetchBalances?.();

      helperToast.success("Withdrawal successful!");
    }
  } catch (error) {
    console.error("Transaction failed:", error);
    helperToast.error("Transaction failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
