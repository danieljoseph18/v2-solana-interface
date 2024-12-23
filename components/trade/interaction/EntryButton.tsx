import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import ConnectWallet from "@/components/nav/ConnectWallet";
import { helperToast } from "@/lib/helperToast";
import PercentageButtons from "./PercentageButtons";
import ModalClose from "@/components/common/ModalClose";
import ModalV2 from "@/components/common/ModalV2";
import { getPriceDecimals } from "@/lib/web3/formatters";
import { formatFloatWithCommas } from "@/lib/web3/formatters";
import CustomTooltip from "@/components/common/CustomTooltip";
import { FaRegQuestionCircle } from "react-icons/fa";
import { createMarketOrder } from "@/app/actions/marketOrder";
import { useWallet } from "@/hooks/useWallet";
import { createLimitOrder } from "@/app/actions/limitOrder";

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
  stopLossSet: boolean;
  takeProfitSet: boolean;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  entryPrice: number;
  positionFee: number;
  liqPrice: number;
  priceImpact: number;
  collateralPrices: {
    solPrice: number;
    usdcPrice: number;
  };
  triggerRefetchPositions: () => void;
  resetInputs: () => void;
  triggerRefreshVolume: () => void;
  updateMarketStats: () => void;
  createPendingPosition: (position: Position) => void;
  refreshPendingPosition: (id: string, success: boolean) => void;
};

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
  stopLossSet,
  takeProfitSet,
  stopLossPercentage,
  takeProfitPercentage,
  stopLossPrice,
  takeProfitPrice,
  entryPrice,
  positionFee,
  liqPrice,
  priceImpact,
  collateralPrices,
  triggerRefetchPositions,
  resetInputs,
  triggerRefreshVolume,
  updateMarketStats,
  createPendingPosition,
  refreshPendingPosition,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { address } = useWallet();

  const [state, setState] = useState({
    selectedOption: "0.3",
    customValue: "",
    availableLiquidity: 0,
    positionFeeInCollateral: 0,
    isButtonDisabled: false,
    disabledText: "",
  });

  const [countdown, setCountdown] = useState(5);

  const active = true;

  const updateState = (newState: Partial<typeof state>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const getAvailableLiquidity = async () => {
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    const response = await fetch(`${BACKEND_URL}/liquidity`);
    const data: {
      availableLiquidity: string;
      totalLiquidity: string;
      utilizationRate: string;
      maxUtilizationRate: string;
    } = await response.json();

    let prevState = state;

    prevState.availableLiquidity = parseFloat(data.availableLiquidity);

    setState(prevState);
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
        ? collateralPrices.solPrice
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

  useEffect(() => {
    getAvailableLiquidity();
  }, []);

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

  /**
   * ========================== ACTIONS ==========================
   */

  const handleCreateOrder = async () => {
    if (isLimit) {
      handleCreateLimitOrder();
    } else {
      handleCreateMarketOrder();
    }
  };

  const handleCreateMarketOrder = async () => {
    if (!address) {
      helperToast.error("Please connect your wallet");
      return;
    }

    try {
      const orderRequest: OrderRequest = {
        marketId,
        userId: address,
        side: isLong ? OrderSide.LONG : OrderSide.SHORT,
        size: sizeDelta.toString(),
        leverage: leverage.toString(),
        stopLossPrice: stopLossSet ? stopLossPrice.toString() : undefined,
        takeProfitPrice: takeProfitSet ? takeProfitPrice.toString() : undefined,
      };

      onClose();

      const response = await createMarketOrder(orderRequest);
      if (!response || !response.success) {
        throw new Error(
          response?.error || "Unknown error creating market order"
        );
      }

      triggerRefetchPositions();
      resetInputs();
      helperToast.success("Order placed successfully");
    } catch (error: any) {
      console.error("[Market Order Error]:", {
        error,
        message: error.message,
        code: error.code,
        data: error.data,
        stack: error.stack,
      });

      let errorMessage = "Failed to place market order";

      if (error.code === "NETWORK_ERROR") {
        errorMessage = "Network error - please check your connection";
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for this trade";
      } else if (error.message) {
        errorMessage = error.message;
      }

      helperToast.error(errorMessage);
    }
  };

  const handleCreateLimitOrder = async () => {
    if (!address) {
      helperToast.error("Please connect your wallet");
      return;
    }

    try {
      const limitOrderRequest: LimitOrderRequest = {
        marketId,
        userId: address,
        side: isLong ? OrderSide.LONG : OrderSide.SHORT,
        size: sizeDelta.toString(),
        leverage: leverage.toString(),
        stopLossPrice: stopLossSet ? stopLossPrice.toString() : undefined,
        takeProfitPrice: takeProfitSet ? takeProfitPrice.toString() : undefined,
        price: limitPrice.toString(),
        token: collateralToken as TokenType,
        type: OrderType.LIMIT,
      };

      onClose();

      const response = await createLimitOrder(limitOrderRequest);
      if (!response || !response.success) {
        throw new Error(
          response?.error || "Unknown error creating limit order"
        );
      }

      triggerRefetchPositions();
      resetInputs();
      helperToast.success("Limit order placed successfully");
    } catch (error: any) {
      console.error("[Limit Order Error]:", {
        error,
        message: error.message,
        code: error.code,
        data: error.data,
        stack: error.stack,
      });

      let errorMessage = "Failed to place limit order";

      if (error.code === "NETWORK_ERROR") {
        errorMessage = "Network error - please check your connection";
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for this trade";
      } else if (error.message) {
        errorMessage = error.message;
      }

      helperToast.error(errorMessage);
    }
  };

  /**
   * ========================== RENDER ==========================
   */

  const renderButton = () => {
    if (
      state.isButtonDisabled &&
      state.disabledText === "Insufficient Liquidity"
    ) {
      return (
        <Button
          onPress={() => {}}
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
