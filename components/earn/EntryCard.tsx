import { BsCreditCardFill } from "react-icons/bs";
import PoolToggles from "./PoolToggles";
import { CollateralType, TabType } from "@/types/earn";
import { getImageUrlFromTokenSymbol } from "@/lib/utils/getTokenImage";
import AssetDropdown from "../common/AssetDropdown";
import { COLLATERAL_OPTIONS } from "@/lib/constants";
import NumberInput from "../common/NumberInput";
import ModalClose from "../common/ModalClose";
import { Button } from "@nextui-org/react";
import { useCallback, useState } from "react";
import { BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { toast } from "react-toastify";
import { useWallet } from "@/hooks/useWallet";
import { contractAddresses } from "@/lib/web3/config";
import { getOrCreateUsdcAccount } from "@/lib/web3/actions/getOrCreateUsdcAccount";
import { createSyncNativeInstruction } from "@solana/spl-token";
import getOrCreateAssociatedTokenAccount from "@/lib/web3/actions/getOrCreateTokenAccount";
import { getOrCreateCustomSolAccount } from "@/lib/web3/actions/getOrCreateCustomSolAccount";
import Image from "next/image";
import SolanaWallet from "@/app/assets/earn/solana-wallet.svg";

const EntryCard = ({
  isDeposit,
  activeTab,
  setActiveTab,
  collateralType,
  setCollateralType,
  amount,
  setAmount,
  isModalForm = false,
  prices,
  balancesUsd,
  lpTokenPrice,
  lpBalance,
  handleCardClick,
  setIsModalOpen,
}: {
  isDeposit: boolean;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  collateralType: CollateralType;
  setCollateralType: (collateral: CollateralType) => void;
  amount: string;
  setAmount: (amount: string) => void;
  isModalForm?: boolean;
  prices: {
    solPrice: number;
    usdcPrice: number;
  };
  balancesUsd: {
    solBalanceUsd: number;
    usdcBalanceUsd: number;
  };
  lpTokenPrice: number;
  lpBalance: number;
  handleCardClick?: () => void;
  setIsModalOpen?: (isOpen: boolean) => void;
}) => {
  const {
    address: publicKey,
    connection,
    program,
    signTransaction,
    sendRegularTransaction,
  } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleTransaction = useCallback(async () => {
    if (!publicKey || !amount || !program || !signTransaction || !prices)
      return;

    setIsLoading(true);

    try {
      console.log("prices", prices);

      const amountNative = isDeposit
        ? collateralType === "SOL"
          ? parseFloat(amount) / prices.solPrice
          : parseFloat(amount) / prices.usdcPrice
        : parseFloat(amount) / lpTokenPrice;

      console.log("amountNative", amountNative);

      const amountBaseUnits = Math.round(
        isDeposit
          ? collateralType === "SOL"
            ? amountNative * 1e9
            : amountNative * 1e6
          : amountNative * 1e6
      );

      console.log("Amount base units: ", amountBaseUnits);

      const userKey = new PublicKey(publicKey);
      const poolAddress = new PublicKey(contractAddresses.devnet.poolStatePda);

      // Get pool state PDA
      const poolState = await program.account.poolState.fetch(poolAddress);

      console.log("Calling function with owner: ", publicKey);

      // Only create token account if we're withdrawing
      const userTokenAccount = !isDeposit
        ? await getOrCreateAssociatedTokenAccount(
            connection,
            userKey,
            collateralType === "SOL"
              ? new PublicKey(contractAddresses.devnet.solMint)
              : new PublicKey(contractAddresses.devnet.usdcMint),
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

        console.log("SOL wrapped successfully:", signature);
      }

      const [userStateAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("user-state"), new PublicKey(publicKey).toBuffer()],
        program.programId
      );

      console.log("userStateAccount", userStateAccount.toBase58());

      // Get LP token mint from pool state
      const lpTokenMint = poolState.lpTokenMint;

      console.log("lpTokenMint", lpTokenMint.toBase58());

      const userLpTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        userKey,
        lpTokenMint,
        userKey,
        signTransaction
      );

      console.log("userLpTokenAccount", userLpTokenAccount.toBase58());

      // Get vault account based on collateral type
      const vaultAccount = new PublicKey(
        collateralType === "SOL" ? poolState.solVault : poolState.usdcVault
      );

      console.log("vaultAccount", vaultAccount.toBase58());

      if (isDeposit) {
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
              contractAddresses.devnet.chainlinkProgram
            ),
            chainlinkFeed: new PublicKey(
              contractAddresses.devnet.chainlinkFeed
            ),
            tokenProgram: new PublicKey(contractAddresses.devnet.tokenProgram),
            systemProgram: new PublicKey(
              contractAddresses.devnet.systemProgram
            ),
          })
          .rpc();

        toast.success("Deposit successful!");
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
              contractAddresses.devnet.chainlinkProgram
            ),
            chainlinkFeed: new PublicKey(
              contractAddresses.devnet.chainlinkFeed
            ),
            tokenProgram: new PublicKey(contractAddresses.devnet.tokenProgram),
          })
          .rpc();

        toast.success("Withdrawal successful!");
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Transaction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connection, amount, collateralType, isDeposit]);

  const handleMaxClick = () => {
    if (isDeposit) {
      setAmount(balancesUsd.solBalanceUsd.toFixed(2));
    } else {
      setAmount(lpBalance.toFixed(2));
    }
  };

  return (
    <div className="hidden md:flex flex-1 bg-button-grad p-0.5 rounded-7 ">
      <div className="flex flex-col gap-2 w-full h-full bg-card-grad rounded-7 p-4">
        {/* Deposit and Withdraw Buttons */}
        <div className="flex flex-row items-center gap-2">
          <PoolToggles activeTab={activeTab} setActiveTab={setActiveTab} />
          {isModalForm && setIsModalOpen && (
            <ModalClose onClose={() => setIsModalOpen(false)} />
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex w-full items-center justify-between">
            <p className="text-gray-text text-sm">
              {isDeposit ? "Deposit" : "Withdraw"}
            </p>
            {isDeposit && !isModalForm && (
              <button
                className="flex items-center gap-1 text-printer-orange text-sm font-bold hover:opacity-80 cursor-pointer"
                onClick={handleCardClick}
              >
                <BsCreditCardFill />
                <p>Deposit with Card</p>
              </button>
            )}
          </div>
        </div>

        {/* Asset Selection Dropdown */}
        <div className="bg-button-grad p-0.5 rounded-7">
          <div className="flex items-center gap-2 w-full justify-between rounded-7 bg-card-grad p-4">
            <div className="flex items-center gap-2">
              <img
                src={getImageUrlFromTokenSymbol(collateralType)}
                alt={`${collateralType} Token`}
                width={24}
                height={24}
                className="rounded-full"
              />
              <p className="text-white text-base font-light">
                {collateralType}
              </p>
            </div>
            <AssetDropdown
              options={COLLATERAL_OPTIONS}
              selectedOption={collateralType}
              onOptionSelect={(option) =>
                setCollateralType(option as CollateralType)
              }
              showImages={true}
              showText={false}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex w-full items-center justify-between">
            <p className="text-gray-text text-sm">Amount</p>
            <div className="flex items-center gap-2">
              <Image src={SolanaWallet} alt="solana-wallet" className="w-4" />
              <p className="text-white font-medium text-xs">
                {isDeposit
                  ? `$${balancesUsd.solBalanceUsd.toFixed(2)}`
                  : `${lpBalance.toFixed(2)}`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center h-[64px]">
          <div className="flex items-center justify-between bg-card-grad h-[64px] border-cardborder border-2 rounded-7 px-3 py-4 w-full">
            <div className="flex gap-1 items-center w-fit max-w-[30%]">
              <p className="text-white font-bold text-sm md:text-lg">
                {isDeposit ? "$" : ""}
              </p>
              <NumberInput
                value={amount}
                onValueChange={setAmount}
                className="text-sm text-white md:text-lg font-bold focus:outline focus:outline-none bg-transparent text-left overflow-x-auto w-[150px] lg:w-[60px] xl:w-[150px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="bg-button-grad hover:bg-button-grad-hover !min-w-[38px] !w-[38px] hidden md:flex !h-[30px] !min-h-[30px] text-13 md:text-15 rounded-3 border-2 border-printer-orange"
                onPress={handleMaxClick}
              >
                MAX
              </Button>
            </div>
          </div>
        </div>

        <Button
          className={`w-full !h-[48px] mt-4 rounded-3 border-2 ${
            isDeposit
              ? "bg-green-grad hover:bg-green-grad-hover border-printer-green"
              : "bg-red-grad hover:bg-red-grad-hover border-printer-red"
          }`}
          onPress={handleTransaction}
          disabled={!publicKey || isLoading}
        >
          {!publicKey
            ? "Connect Wallet"
            : isLoading
            ? "Processing..."
            : isDeposit
            ? "Deposit"
            : "Withdraw"}
        </Button>
      </div>
    </div>
  );
};

export default EntryCard;
