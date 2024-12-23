"use client";

import { useState, useEffect } from "react";
import { Button, Checkbox } from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";
import NumberPad from "./NumberPad";
import LiquidityDropdown from "./LiquidityDropdown";
import NumberInput from "../common/NumberInput";
import { helperToast } from "@/lib/helperToast";
import { useWallet } from "@/hooks/useWallet";
import { requestWithdrawal, getBalance } from "@/app/actions/margin";

const Withdraw = ({
  handleWithdrawBackClick,
  prices,
  onSuccess,
}: {
  handleWithdrawBackClick: () => void;
  prices: { [key: string]: number };
  onSuccess: () => void;
}) => {
  const [amountUsd, setAmountUsd] = useState<string>("100");
  const [withdrawToken, setWithdrawToken] = useState<TokenType>("SOL");
  const [withdrawTokenOptions] = useState<TokenType[]>(["SOL", "USDC"]);
  const [tokenAmount, setTokenAmount] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [balance, setBalance] = useState<string>("0");

  const { address, isConnected, connect } = useWallet();

  useEffect(() => {
    if (isConnected && address) {
      fetchBalance();
    }
  }, [withdrawToken, isConnected, address]);

  const fetchBalance = async () => {
    if (!address) {
      helperToast.error("Please connect your wallet first");
      return;
    }

    try {
      const balanceData = await getBalance(address, withdrawToken);
      setBalance(balanceData.amount);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      helperToast.error("Failed to fetch balance");
    }
  };

  const handleWithdrawTokenSelect = (option: TokenType) => {
    setWithdrawToken(option);
    updateTokenAmount(parseFloat(amountUsd), option);
  };

  const updateTokenAmount = (usdAmount: number, token: TokenType) => {
    const tokenPrice = prices[token] || 1;
    const calculatedTokenAmount = (usdAmount / tokenPrice).toFixed(8);
    setTokenAmount(calculatedTokenAmount);
  };

  const handleAmountUsdChange = (value: string) => {
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      const newAmountUsd = value === "" || value === "." ? "0" : value;
      setAmountUsd(newAmountUsd);
      updateTokenAmount(parseFloat(newAmountUsd), withdrawToken);
    }
  };

  const handleWithdraw = async () => {
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

    if (parseFloat(tokenAmount) <= 0) {
      helperToast.error("Please enter a valid amount");
      return;
    }

    if (parseFloat(tokenAmount) > parseFloat(balance)) {
      helperToast.error("Insufficient balance");
      return;
    }

    try {
      setIsLoading(true);

      await requestWithdrawal(address, tokenAmount, withdrawToken);

      helperToast.success("Withdrawal request submitted successfully!");
      onSuccess();
    } catch (error) {
      console.error("Withdrawal failed:", error);
      helperToast.error(
        error instanceof Error ? error.message : "Failed to process withdrawal"
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
            onClick={handleWithdrawBackClick}
          />
          <p className="text-lg font-medium text-white">
            Withdraw <span className="text-dashboard-gray">($USD)</span>
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
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-white font-semibold">
                    Withdraw Token
                  </p>
                  <p className="text-sm text-white font-semibold">
                    Available: {balance} {withdrawToken}{" "}
                    <span className="text-dashboard-gray font-normal">
                      ($
                      {(
                        parseFloat(balance) * (prices[withdrawToken] || 1)
                      ).toFixed(2)}
                      )
                    </span>
                  </p>
                </div>
              }
              selectedToken={withdrawToken}
              tokenOptions={withdrawTokenOptions}
              setSelectedToken={handleWithdrawTokenSelect}
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
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
            <Button
              className={`${
                parseFloat(amountUsd) === parseFloat(balance)
                  ? "bg-green-grad hover:bg-green-grad-hover border-printer-green border-2"
                  : "bg-input-grad hover:bg-input-grad-hover border-cardborder border-2"
              } text-white rounded-[53px]`}
              onPress={() => handleAmountUsdChange(balance)}
            >
              Max
            </Button>
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
              !termsAccepted || parseFloat(amountUsd) > parseFloat(balance)
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-grad-hover cursor-pointer"
            }`}
            onPress={handleWithdraw}
            disabled={
              isLoading ||
              !termsAccepted ||
              parseFloat(amountUsd) > parseFloat(balance)
            }
          >
            {isLoading
              ? "Processing..."
              : !isConnected
              ? "Connect Wallet"
              : "Confirm Withdraw"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
