"use client";

import { useState } from "react";
import { Button, Checkbox } from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";
import NumberPad from "./NumberPad";
import LiquidityDropdown from "./LiquidityDropdown";
import NumberInput from "../common/NumberInput";
import { helperToast } from "@/lib/helperToast";
import { useWallet } from "@/hooks/useWallet";
import { depositMargin } from "@/app/actions/margin";
import { getAdminWallet } from "@/lib/web3/config";

const Deposit = ({
  handleDepositBackClick,
  prices,
  onSuccess,
}: {
  handleDepositBackClick: () => void;
  prices: { [key: string]: number };
  onSuccess: () => void;
}) => {
  const [amountUsd, setAmountUsd] = useState<string>("100");
  const [depositToken, setDepositToken] = useState<TokenType>("SOL");
  const [depositTokenOptions] = useState<TokenType[]>(["SOL", "USDC"]);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { address, isConnected, connect, sendTransaction } = useWallet();

  const handleDepositTokenSelect = (option: TokenType) => {
    setDepositToken(option);
  };

  const handleAmountUsdChange = (value: string) => {
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      setAmountUsd(value === "" || value === "." ? "0" : value);
    }
  };

  const handleDeposit = async () => {
    if (!isConnected) {
      try {
        connect();
      } catch (error) {
        return; // Error toast is handled in the hook
      }
      return;
    }

    if (!address) {
      helperToast.error("Please connect your wallet first");
      return;
    }

    if (parseFloat(amountUsd) <= 0) {
      helperToast.error("Please enter a valid amount");
      return;
    }

    try {
      setIsLoading(true);

      const ADMIN_WALLET = getAdminWallet();

      // Convert amount in USD to amount in tokens
      let tokenAmount: string;
      if (depositToken === "SOL") {
        tokenAmount = (Number(amountUsd) / prices.SOL).toFixed(8);
      } else {
        tokenAmount = (Number(amountUsd) / prices.USDC).toFixed(2);
      }

      // Send transaction to admin wallet
      const txHash = await sendTransaction({
        to: ADMIN_WALLET,
        value: tokenAmount,
        token: depositToken,
      });

      // Notify backend about the deposit
      await depositMargin(address, tokenAmount, depositToken, txHash);

      helperToast.success("Deposit successful!");
      handleDepositBackClick(); // Return to dashboard
      onSuccess(); // Trigger refresh
    } catch (error) {
      console.error("Deposit failed:", error);
      helperToast.error(
        error instanceof Error ? error.message : "Failed to process deposit"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-full bg-card-grad text-white p-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-row items-center justify-between pb-6">
          <FaArrowLeft
            className="h-6 w-6 cursor-pointer text-white hover:opacity-80"
            onClick={handleDepositBackClick}
          />
          <p className="text-lg font-medium text-white">
            Deposit <span className="text-dashboard-gray">($USD)</span>
          </p>
          <div></div>
        </div>
        <div className="space-y-4">
          <div className="bg-input-grad border-cardborder border-2 rounded-xl p-4 text-center">
            <NumberInput
              value={amountUsd}
              onValueChange={handleAmountUsdChange}
              className="text-4xl font-medium text-white bg-transparent text-center w-full outline-none"
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <LiquidityDropdown
              headerElement={
                <p className="text-sm text-white mb-2">Deposit Token</p>
              }
              selectedToken={depositToken}
              tokenOptions={depositTokenOptions}
              setSelectedToken={handleDepositTokenSelect}
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[10, 20, 50, 100].map((value) => (
              <Button
                key={value}
                className={`${
                  parseFloat(amountUsd) === value
                    ? "bg-green-grad hover:bg-green-grad-hover border-printer-green border-2"
                    : "bg-input-grad hover:bg-input-grad-hover border-cardborder border-2"
                } text-white rounded-[53px]`}
                onPress={() => handleAmountUsdChange(value.toString())}
              >
                ${value}
              </Button>
            ))}
          </div>
          <NumberPad onValueChange={handleAmountUsdChange} value={amountUsd} />
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              isSelected={termsAccepted}
              onValueChange={setTermsAccepted}
              color="default"
            />
            <label htmlFor="terms" className="text-sm text-dashboard-gray">
              I agree to the Terms & Conditions
            </label>
          </div>
          <Button
            className={`w-full bg-green-grad text-white py-4! px-4 rounded-[53px] border-printer-green border-1 ${
              !termsAccepted
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-grad-hover cursor-pointer"
            }`}
            onPress={handleDeposit}
            disabled={isLoading || !termsAccepted}
          >
            {isLoading
              ? "Processing..."
              : !isConnected
              ? "Connect Wallet"
              : "Confirm Deposit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
