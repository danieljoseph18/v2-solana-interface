"use client";

import { useState } from "react";
import { Button, Checkbox } from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";
import NumberPad from "./NumberPad";
import LiquidityDropdown from "./LiquidityDropdown";
import NumberInput from "../common/NumberInput";
import { helperToast } from "@/lib/helperToast";

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
  const [withdrawToken, setWithdrawToken] = useState("ETH");
  const [withdrawTokenOptions] = useState(["ETH", "WETH", "USDC"]);
  const [tokenAmount, setTokenAmount] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleWithdrawTokenSelect = (option: string) => {
    setWithdrawToken(option);
    updateTokenAmount(parseFloat(amountUsd), option);
  };

  const updateTokenAmount = (usdAmount: number, token: string) => {
    setTokenAmount(usdAmount.toString());
    setAmountUsd(usdAmount.toFixed(2));
  };

  const handleAmountUsdChange = (value: string) => {
    // Validate the input to ensure it's a valid number format
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      const newAmountUsd = value === "" || value === "." ? "0" : value;
      setAmountUsd(newAmountUsd);
      updateTokenAmount(parseFloat(newAmountUsd), withdrawToken);
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
                    Available: {tokenAmount} {withdrawToken}{" "}
                    <span className="text-dashboard-gray font-normal">
                      (${amountUsd})
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
                parseFloat(amountUsd) === parseFloat(amountUsd)
                  ? "bg-green-grad hover:bg-green-grad-hover border-printer-green border-2"
                  : "bg-input-grad hover:bg-input-grad-hover border-cardborder border-2"
              } text-white rounded-[53px]`}
              onPress={() => handleAmountUsdChange(amountUsd)}
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
              !termsAccepted
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-grad-hover cursor-pointer"
            }`}
            onPress={() => {}}
            disabled={
              isLoading || !termsAccepted || parseFloat(tokenAmount) <= 0
            }
          >
            {isLoading ? "Processing..." : "Confirm Withdraw"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
