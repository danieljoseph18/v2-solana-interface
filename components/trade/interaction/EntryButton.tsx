import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import ConnectWallet from "@/components/nav/ConnectWallet";
import { helperToast } from "@/lib/helperToast";
import PercentageButtons from "./PercentageButtons";
import ModalClose from "@/components/common/ModalClose";
import { useAsset } from "../assets/AssetContext";
import ModalV2 from "@/components/common/ModalV2";
import { getPriceDecimals } from "@/lib/web3/formatters";
import { formatFloatWithCommas } from "@/lib/web3/formatters";
import CustomTooltip from "@/components/common/CustomTooltip";
import { FaRegQuestionCircle } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

type EntryButtonProps = {
  marketId: `0x${string}`;
  isLong: boolean;
  isLimit: boolean;
  isTrigger: boolean;
  ticker: string;
  leverage: number;
  collateralToken: string;
  collateralDelta: number;
  collateralDeltaUsd: number;
  sizeDelta: number;
  limitPrice: number;
  isIncrease: boolean;
  reverseWrap: boolean;
  stopLossSet: boolean;
  takeProfitSet: boolean;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  entryPrice: number;
  positionFee: number;
  executionFees: {
    executionFee: number;
    priceUpdateFee: number;
  };
  liqPrice: number;
  priceImpact: number;
  collateralPrices: {
    ethPrice: number;
    usdcPrice: number;
  };
  triggerRefetchPositions: () => void;
  resetInputs: () => void;
  fetchExecutionFees: () => void;
  triggerRefreshVolume: () => void;
  updateMarketStats: () => void;
  createPendingPosition: (position: Position) => void;
  refreshPendingPosition: (id: string, success: boolean) => void;
};

const marketOrderSteps = [
  {
    text: "Approve Tokens",
    subtext: "Approve the contract to spend tokens.",
    failedText: "Failed to approve tokens.",
    failedSubtext: "Please try again.",
    successText: "Tokens Approved!",
    successSubtext: "You can now deposit tokens.",
  },
  {
    text: "Initiate Transaction",
    subtext: "Initiate the transaction onchain.",
    failedText: "Failed to initiate transaction.",
    failedSubtext: "Please try again.",
    successText: "Transaction Initiated!",
    successSubtext: "Waiting for a keeper to execute the transaction.",
  },
];

const limitOrderSteps = [
  {
    text: "Approve Tokens",
    subtext: "Approve the contract to spend tokens.",
    failedText: "Failed to approve tokens.",
    failedSubtext: "Please try again.",
    successText: "Tokens Approved!",
    successSubtext: "You can now deposit tokens.",
  },
  {
    text: "Initiate Transaction",
    subtext: "Initiate the transaction onchain.",
    failedText: "Failed to initiate transaction.",
    failedSubtext: "Please try again.",
    successText: "Transaction Initiated!",
    successSubtext: "Waiting for a keeper to execute the transaction.",
  },
];

const EntryButton: React.FC<EntryButtonProps> = ({
  marketId,
  isLong,
  isLimit,
  isTrigger,
  ticker,
  leverage,
  collateralToken,
  collateralDelta,
  collateralDeltaUsd,
  sizeDelta,
  limitPrice,
  isIncrease,
  reverseWrap,
  stopLossSet,
  takeProfitSet,
  stopLossPercentage,
  takeProfitPercentage,
  stopLossPrice,
  takeProfitPrice,
  entryPrice,
  positionFee,
  executionFees,
  liqPrice,
  priceImpact,
  collateralPrices,
  triggerRefetchPositions,
  resetInputs,
  fetchExecutionFees,
  triggerRefreshVolume,
  updateMarketStats,
  createPendingPosition,
  refreshPendingPosition,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { asset } = useAsset();

  const [state, setState] = useState({
    selectedOption: "0.3",
    customValue: "",
    availableLiquidity: 0,
    isTransactionPendingModalOpen: false,
    currentStep: 0,
    hasFailedAtCurrentStep: false,
    isTransactionComplete: false,
    positionFeeInCollateral: 0,
    isButtonDisabled: false,
    disabledText: "",
  });

  const [isLiquidityModalOpen, setIsLiquidityModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const active = true;

  const updateState = (newState: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const handleOpen = useCallback(() => {
    if (
      collateralDelta > 0 &&
      !Number.isNaN(collateralDelta) &&
      !state.isButtonDisabled
    ) {
      onOpen();
    }
  }, [collateralDelta, state.isButtonDisabled, onOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchExecutionFees();
    }
  }, [isOpen, fetchExecutionFees]);

  useEffect(() => {
    const checkButtonState = () => {
      let isDisabled = false;
      let text = "";

      if (collateralDeltaUsd === 0 || Number.isNaN(collateralDeltaUsd)) {
        isDisabled = true;
        text = "Enter an Amount";
      } else if (collateralDeltaUsd < 2) {
        isDisabled = true;
        text = "Min Trade Size 2 USD";
      } else if (sizeDelta > state.availableLiquidity) {
        isDisabled = true;
        text = "Insufficient Liquidity";
      } else {
        // Calculate max slippage based on selected option
        const slippagePercent =
          state.selectedOption === "Custom"
            ? parseFloat(state.customValue)
            : parseFloat(state.selectedOption);

        if (!isNaN(slippagePercent)) {
          const maxSlippageUsd = (slippagePercent / 100) * collateralDeltaUsd;
          if (priceImpact < 0 && Math.abs(priceImpact) > maxSlippageUsd) {
            isDisabled = true;
            text = "Slippage Exceeds Max";
          }
        } else {
          isDisabled = true;
          text = "Invalid Slippage";
        }
      }

      updateState({ isButtonDisabled: isDisabled, disabledText: text });
    };

    checkButtonState();
  }, [
    collateralDeltaUsd,
    sizeDelta,
    state.availableLiquidity,
    priceImpact,
    state.selectedOption,
    state.customValue,
  ]);

  useEffect(() => {
    const fetchPositionFeeInCollateral = async () => {
      const collateralPrice = isLong
        ? collateralPrices.ethPrice
        : collateralPrices.usdcPrice;
      const positionFeeInCollateral = positionFee / collateralPrice;
      updateState({ positionFeeInCollateral });
    };

    fetchPositionFeeInCollateral();
  }, [positionFee, collateralPrices, isLong]);

  useEffect(() => {
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown((prevCount) => (prevCount > 0 ? prevCount - 1 : 5));
    }, 1000);

    return () => clearInterval(timer);
  }, [entryPrice]);

  const buttonText = useMemo(() => {
    if (state.isButtonDisabled) return state.disabledText;
    if (collateralDeltaUsd < 2) return "Min Trade Size 2 USD";
    if (isTrigger) return "Create Trigger Order";
    return `${isLimit ? "Limit" : "Market"} ${isLong ? "Long" : "Short"} ${
      ticker.split(":")[0]
    }`;
  }, [
    state.isButtonDisabled,
    state.disabledText,
    collateralDeltaUsd,
    isTrigger,
    isLimit,
    isLong,
    ticker,
  ]);

  const getDisplayPrice = (price: number) => {
    const priceDecimals = getPriceDecimals(price);
    return price.toFixed(priceDecimals);
  };

  const getCountdownColor = (seconds: number) => {
    if (seconds >= 4) return "text-printer-green";
    if (seconds === 3) return "text-printer-orange";
    return "text-printer-red";
  };

  const calculateProjectedEarnings = useCallback(() => {
    const targetPrice = takeProfitSet ? takeProfitPrice : entryPrice * 1.2;
    const profitPercentage = ((targetPrice - entryPrice) / entryPrice) * 100;
    return {
      earnings: (sizeDelta * (profitPercentage / 100)).toFixed(2),
      targetPrice,
      profitPercentage,
    };
  }, [takeProfitSet, takeProfitPrice, entryPrice, sizeDelta]);

  const renderButton = () => {
    if (
      state.isButtonDisabled &&
      state.disabledText === "Insufficient Liquidity"
    ) {
      return (
        <Button
          onPress={() => setIsLiquidityModalOpen(true)}
          className="w-full flex items-center justify-center text-center text-base bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 text-white py-4 font-bold"
        >
          {state.disabledText}
        </Button>
      );
    }

    return (
      <Button
        onPress={active && !state.isButtonDisabled ? handleOpen : undefined}
        disabled={state.isButtonDisabled}
        className={`w-full flex items-center justify-center text-center text-base bg-p3-button hover:bg-p3-button-hover ${
          state.isButtonDisabled ? " cursor-not-allowed" : ""
        } border-2 border-p3 !rounded-3 text-white py-4 font-bold`}
      >
        {buttonText}
      </Button>
    );
  };

  return (
    <>
      {active ? (
        renderButton()
      ) : (
        <ConnectWallet styles="w-full flex items-center justify-center text-center text-base bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 text-white py-4 font-bold " />
      )}
      <ModalV2 isOpen={isOpen} setIsModalOpen={onClose} size="lg">
        <div className="flex flex-col gap-4 w-full h-full pb-12 md:pb-6 p-6">
          <div className="flex flex-row justify-between w-full items-center mb-4">
            <p className="text-lg font-bold">Confirm Order</p>
            <ModalClose onClose={onClose} />
          </div>
          <div className="h-px w-full bg-gray-text" />
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-row justify-between w-full text-gray-text">
              <p>Leverage</p>
              <p>{leverage}x</p>
            </div>
            <PercentageButtons
              title="Max Slippage"
              options={["0.1", "0.3", "0.5", "1", "Custom"]}
              isLong={isLong}
              selectedOption={state.selectedOption}
              setSelectedOption={(option) =>
                updateState({ selectedOption: option })
              }
              customValue={state.customValue}
              setCustomValue={(value) => updateState({ customValue: value })}
            />
            <div className="flex justify-between items-center text-gray-text">
              <p>Entry Price</p>
              <p>{`$${getDisplayPrice(entryPrice)}`}</p>
            </div>
            <div className="flex justify-between items-center text-gray-text w-full">
              <p>Price reserved for the next:</p>
              <p className={`font-bold ${getCountdownColor(countdown)}`}>
                {countdown}s
              </p>
            </div>
            <div className="flex justify-between items-center text-gray-text">
              <p>Liq Price</p>
              <p>{`$${getDisplayPrice(liqPrice)}`}</p>
            </div>
            <div className="h-px w-full bg-gray-text" />
            <div className="flex justify-between items-center text-gray-text">
              <p>{`Collateral in (including fee)`}</p>
              <p>{collateralDelta + state.positionFeeInCollateral}</p>
            </div>
            <div className="flex justify-between items-center text-gray-text">
              <p>Position Fee</p>
              <p>{`$${positionFee.toFixed(4)}`}</p>
            </div>
            <div className="flex justify-between items-center text-gray-text">
              <p>Execution Fee</p>
              <p>{`${executionFees.executionFee} ETH`}</p>
            </div>
            <div className="flex justify-between items-center text-gray-text">
              <p>Price Update Fee</p>
              <p>{`${executionFees.priceUpdateFee.toFixed(18)} ETH`}</p>
            </div>
            <div className="flex justify-between items-center text-gray-text">
              <p>Price Impact</p>
              <p>
                {priceImpact > 0 ? "+$" : "$"}
                {priceImpact.toFixed(2)}
              </p>
            </div>
            <div className="h-px w-full bg-gray-text" />
            <div className="flex justify-between items-center text-gray-text">
              <p>Projected Earnings</p>
              <CustomTooltip
                content={
                  <span>
                    Estimated profit if price hits $
                    {calculateProjectedEarnings().targetPrice.toFixed(2)}, or a{" "}
                    {calculateProjectedEarnings().profitPercentage.toFixed(2)}%
                    price move in the favourable direction.
                  </span>
                }
                placement="top"
              >
                <div className="flex gap-2 items-center">
                  <FaRegQuestionCircle className="text-white" />
                  <p className="text-printer-green font-bold cursor-help">
                    $
                    {formatFloatWithCommas(
                      parseFloat(calculateProjectedEarnings().earnings)
                    )}
                  </p>
                </div>
              </CustomTooltip>
            </div>
          </div>

          <Button
            type="submit"
            onPress={() => {}}
            disabled={!active}
            className="w-full flex items-center justify-center text-center text-base bg-green-grad hover:bg-green-grad-hover border-2 border-printer-green !rounded-3 text-white !py-4 md:py-6 font-bold"
          >
            Execute
          </Button>
        </div>
      </ModalV2>
    </>
  );
};

export default EntryButton;
