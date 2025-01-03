import PoolToggles from "./PoolToggles";
import { CollateralType, TabType, EntryProps } from "@/types/earn";
import { getImageUrlFromTokenSymbol } from "@/lib/utils/getTokenImage";
import AssetDropdown from "../common/AssetDropdown";
import { COLLATERAL_OPTIONS } from "@/lib/constants";
import NumberInput from "../common/NumberInput";
import { Button } from "@nextui-org/react";
import { useCallback, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import Image from "next/image";
import PrinterWallet from "@/app/assets/earn/printer-wallet.png";
import { depositWithdraw } from "@/lib/web3/actions/depositWithdraw";

const EntryCard = ({
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
  refetchBalances,
}: EntryProps) => {
  const {
    address: publicKey,
    connection,
    program,
    signTransaction,
    sendRegularTransaction,
  } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleMaxClick = () => {
    if (isDeposit) {
      setAmount(balancesUsd.solBalanceUsd.toFixed(2));
    } else {
      setAmount(lpBalance.toFixed(2));
    }
  };

  return (
    <div className="hidden md:flex flex-col flex-1 p-4 rounded-7 ">
      <p className="text-white text-lg font-semibold mb-4">
        Manage Your Assets
      </p>
      <div className="flex flex-col gap-2 w-full h-full bg-card-grad border-2 border-cardborder modal-gradient-shadow rounded-7 p-4">
        {/* Deposit and Withdraw Buttons */}
        <div className="flex flex-row items-center gap-2">
          <PoolToggles activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex w-full items-center justify-between">
            <p className="text-gray-text text-sm">
              {isDeposit ? "Deposit" : "Withdraw"}
            </p>
          </div>
        </div>

        {/* Asset Selection Dropdown */}
        <div className="flex items-center gap-2 w-full justify-between rounded-7 bg-input-grad border-2 border-cardborder p-4">
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

        <div className="flex flex-col gap-2 w-full">
          <div className="flex w-full items-center justify-between">
            <p className="text-gray-text text-sm">Amount</p>
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
          </div>
        </div>

        <div className="flex w-full items-center h-[64px]">
          <div className="flex items-center justify-between bg-input-grad h-[64px] border-cardborder border-2 rounded-7 px-3 py-4 w-full">
            <div className="flex gap-1 items-center w-fit max-w-[30%]">
              <p className="text-white font-bold text-lg">
                {isDeposit ? "$" : ""}
              </p>
              <NumberInput
                value={amount}
                onValueChange={setAmount}
                className=" text-white text-lg font-bold focus:outline focus:outline-none bg-transparent text-left overflow-x-auto w-[150px] lg:w-[60px] xl:w-[150px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="bg-button-grad hover:bg-button-grad-hover !min-w-[55px] !w-[55px] flex !h-[30px] !min-h-[30px] text-15 !rounded-3 border-2 border-printer-orange"
                onPress={handleMaxClick}
              >
                MAX
              </Button>
            </div>
          </div>
        </div>

        <Button
          className={`w-full !h-[48px] mt-4 !rounded-3 border-2 ${
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
