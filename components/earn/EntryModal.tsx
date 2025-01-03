import { useCallback, useState } from "react";
import PoolToggles from "./PoolToggles";
import ModalClose from "../common/ModalClose";
import NumberInput from "../common/NumberInput";
import AssetDropdown from "../common/AssetDropdown";
import { getImageUrlFromTokenSymbol } from "@/lib/utils/getTokenImage";
import { CollateralType, EntryProps } from "@/types/earn";
import { COLLATERAL_OPTIONS } from "@/lib/constants";
import NumberKeypad from "../common/NumberKeypad";
import SubmitSwiper from "../common/SubmitSwiper";
import { Checkbox, Link } from "@nextui-org/react";
import Image from "next/image";
import PrinterWallet from "@/app/assets/earn/printer-wallet.png";
import { depositWithdraw } from "@/lib/web3/actions/depositWithdraw";
import { useWallet } from "@/hooks/useWallet";

const QuickTopupButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    className="px-4 py-2 rounded-full bg-button-grad border-2 border-printer-orange hover:bg-button-grad-hover text-center text-white font-medium text-sm flex-grow"
    onClick={onClick}
  >
    <p>{label}</p>
  </button>
);

const depositQuickTopupButtons = ["$10", "$20", "$50", "$100"];
const withdrawalQuickTopupButtons = ["$10", "$20", "$50", "MAX"];

interface EntryCardProps extends EntryProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

const EntryModal = ({
  isDeposit,
  activeTab,
  setActiveTab,
  collateralType,
  setCollateralType,
  amount,
  setAmount,
  prices,
  balancesUsd,
  lpTokenPrice,
  lpBalance,
  setIsModalOpen,
  refetchBalances,
}: EntryCardProps) => {
  const {
    address: publicKey,
    connection,
    program,
    signTransaction,
    sendRegularTransaction,
  } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const handleMaxClick = () => {
    if (isDeposit) {
      setAmount(balancesUsd.solBalanceUsd.toFixed(2));
    } else {
      setAmount(lpBalance.toFixed(2));
    }
  };

  const handleTopUpClick = (value: string) => {
    // Remove $ sign if present and update wager
    const cleanValue = value.startsWith("$") ? value.slice(1) : value;
    setAmount(cleanValue);
  };

  const handleTransaction = useCallback(async () => {
    if (!publicKey || !program || !signTransaction || !sendRegularTransaction)
      return;

    await depositWithdraw(
      connection,
      publicKey,
      amount,
      program,
      signTransaction,
      sendRegularTransaction,
      prices,
      collateralType,
      isDeposit,
      lpTokenPrice,
      setIsLoading,
      refetchBalances
    );
  }, [publicKey, connection, amount, collateralType, isDeposit]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row items-center gap-2">
        <PoolToggles activeTab={activeTab} setActiveTab={setActiveTab} />
        <ModalClose onClose={() => setIsModalOpen(false)} />
      </div>
      <div className="flex items-center w-full justify-between gap-4">
        <div className="flex items-center w-full">
          <span className="text-white text-6xl">$</span>
          <NumberInput
            value={amount}
            onValueChange={(value) => setAmount(value)}
            className="bg-transparent !text-white focus:ring-0 focus:outline-none !w-full !text-6xl"
          />
        </div>
        {activeTab === "withdraw" && (
          <div className="flex items-center gap-2">
            <Image src={PrinterWallet} alt="printer wallet" className="w-4" />
            <p className="text-white font-medium text-xs">
              {isDeposit
                ? `$${
                    collateralType === "SOL"
                      ? balancesUsd.solBalanceUsd.toFixed(2)
                      : balancesUsd.usdcBalanceUsd.toFixed(2)
                  }`
                : `${lpBalance.toFixed(2)}`}
            </p>
          </div>
        )}
      </div>

      {/* Deposit / Withdrawal method dropdown */}
      <p className="text-gray-text text-base font-bold">
        {activeTab === "deposit" ? "Deposit Method" : "Withdrawal Method"}
      </p>
      <div className="bg-button-grad p-0.5 rounded-7">
        <div className="flex items-center gap-2 w-full justify-between rounded-7 bg-input-grad p-4">
          <div className="flex items-center gap-2">
            <Image
              src={getImageUrlFromTokenSymbol(collateralType)}
              alt={`${collateralType} Token`}
              width={24}
              height={24}
              className="rounded-full"
            />
            <p className="text-white text-base font-light">{collateralType}</p>
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

      {/* Quick topup buttons */}
      <div className="flex items-center justify-between w-full gap-4">
        {activeTab === "deposit"
          ? depositQuickTopupButtons.map((button) => (
              <QuickTopupButton
                key={button}
                label={button}
                onClick={() => handleTopUpClick(button)}
              />
            ))
          : withdrawalQuickTopupButtons.map((button) => (
              <QuickTopupButton
                key={button}
                label={button}
                onClick={() =>
                  button === "MAX" ? handleMaxClick() : handleTopUpClick(button)
                }
              />
            ))}
      </div>

      {/* Number keypad */}
      <NumberKeypad onValueChange={setAmount} value={amount} />

      <div className="flex items-center gap-4">
        <Checkbox color="default" />
        <p>
          I have read and agree to the PRINT3R{" "}
          <Link href="/terms-and-conditions" className="text-printer-orange">
            Terms & Conditions
          </Link>
        </p>
      </div>

      {/* Submit button */}
      <SubmitSwiper
        onSuccess={handleTransaction}
        text={isDeposit ? "Deposit" : "Withdraw"}
        disabled={!publicKey || isLoading}
      />
    </div>
  );
};

export default EntryModal;
