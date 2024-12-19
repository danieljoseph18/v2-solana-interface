import InputField from "@/components/common/InputField";
import ModalClose from "@/components/common/ModalClose";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@nextui-org/react";
import TypeButtons from "../interaction/TypeButtons";
import PercentageButtons from "../interaction/PercentageButtons";
import InfoRow from "./stats/InfoRow";
import FeesInfo from "./stats/FeesInfo";
import ToggleSwitch from "@/components/common/ToggleSwitch";
import { getImageUrlFromTokenSymbol } from "@/lib/utils/getTokenImage";
import Image from "next/image";
import { getProfitLoss } from "./helpers";
import { helperToast } from "@/lib/helperToast";
import { formatSmallNumber, getPriceDecimals } from "@/lib/web3/formatters";
import NumberInput from "@/components/common/NumberInput";
import InfoRowWithDelta from "./stats/InfoRowWithDelta";

const DecreasePosition = ({
  onClose,
  position,
  markPrice = 0,
  triggerRefetchPositions,
  updateMarketStats,
  setDecreasingPosition,
}: {
  onClose: () => void;
  position: Position;
  markPrice: number;
  triggerRefetchPositions: () => void;
  updateMarketStats: () => void;
  setDecreasingPosition: (position: Position | null) => void;
}) => {
  const [collateralType, setCollateralType] = useState("ETH");

  const [unwrap, setUnwrap] = useState(true);

  const [limitPrice, setLimitPrice] = useState<string>("0");

  const [customSizeDelta, setCustomSizeDelta] = useState<string>("");

  // "Market" | "Stop Loss" | "Take Profit"
  const [activeType, setActiveType] = useState<string>("Market");

  const [pnl, setPnl] = useState<string>("$0.00");

  const [hasProfit, setHasProfit] = useState<boolean>(false);

  // Used to cache prices so they're not refetched constantly when calculating equivalents
  const [prices, setPrices] = useState<{
    ethPrice: number;
    usdcPrice: number;
  }>({
    ethPrice: 0,
    usdcPrice: 0,
  });

  const [closingFees, setClosingFees] = useState<{
    fundingFee: number;
    borrowFee: number;
    priceImpact: number;
  }>({
    fundingFee: 0,
    borrowFee: 0,
    priceImpact: 0,
  });

  const [fees, setFees] = useState<{
    positionFee: number;
    executionFee: number;
    priceUpdateFee: number;
  }>({
    positionFee: 0,
    executionFee: 0,
    priceUpdateFee: 0,
  });

  // Percentage to close
  const [decreaseOption, setDecreaseOption] = useState<string>("100");
  const [customDecreasePercentage, setCustomDecreasePercentage] =
    useState<string>("");

  // Max Slippage
  const [selectedSlippage, setSelectedSlippage] = useState<string>("0.3");
  const [customSlippage, setCustomSlippage] = useState<string>("");

  const [isTransactionPendingModalOpen, setIsTransactionPendingModalOpen] =
    useState(false);

  const [currentStep, setCurrentStep] = useState(0);

  const [hasFailedAtCurrentStep, setHasFailedAtCurrentStep] = useState(false);

  const [isTransactionComplete, setIsTransactionComplete] = useState(false);

  const [receiveAmounts, setReceiveAmounts] = useState<{
    tokenAmount: number;
    usdAmount: number;
  }>({
    tokenAmount: 0,
    usdAmount: 0,
  });

  const [sizesAfter, setSizesAfter] = useState<{
    sizeAfter: number;
    collateralAfter: number;
  }>({
    sizeAfter: 0,
    collateralAfter: 0,
  });

  const [hasStopLoss, setHasStopLoss] = useState(false);

  const [hasTakeProfit, setHasTakeProfit] = useState(false);

  const decreasePercentageOptions = ["25", "50", "75", "100", "Custom"];

  const slippageOptions = ["0.1", "0.3", "0.5", "1", "Custom"];

  const lastCalculatedDecimals = useRef(30);

  const resetExecutionModalState = () => {
    setIsTransactionPendingModalOpen(false);
    setCurrentStep(0);
    setHasFailedAtCurrentStep(false);
    setIsTransactionComplete(false);
  };

  const handleMaxClick = () => {
    setCustomDecreasePercentage("100");
    setCustomSizeDelta(position.size.toString());
  };

  const handleCustomSizeDeltaChange = (value: string) => {
    if (parseFloat(value) > position.size) {
      setCustomSizeDelta(position.size.toString());
      setDecreaseOption("100");
      return;
    }
    setCustomSizeDelta(value);
    setCustomDecreasePercentage(
      ((parseFloat(value) / position.size) * 100).toFixed(2)
    );
    setDecreaseOption("Custom");
  };

  // Set limit price to mark price when the component mounts
  useEffect(() => {
    setLimitPrice(markPrice.toString());
  }, []);

  const handleLimitPriceChange = (value: string) => {
    setLimitPrice(value);
  };

  useEffect(() => {
    const fetchPnl = async () => {
      const priceToUse =
        activeType === "Stop Loss" || activeType === "Take Profit"
          ? parseFloat(limitPrice)
          : markPrice;
      const profitLoss = getProfitLoss(priceToUse, position);

      const decreasePercentage = parseFloat(decreaseOption) / 100 || 1;
      const profit = parseFloat(
        profitLoss.pnlUsd.replace("$", "").replace(",", "")
      );
      const realizedPnl = profit * decreasePercentage;

      setPnl(`$${realizedPnl.toFixed(2)}`);
      setHasProfit(profitLoss.hasProfit);
    };

    fetchPnl();
  }, [markPrice, limitPrice, position, activeType, decreaseOption]);

  useEffect(() => {
    setCollateralType(position.isLong ? "ETH" : "USDC");
  }, [position.isLong]);

  useEffect(() => {
    const calculateSizesAfter = () => {
      let sizeAfter: number;
      let collateralAfter: number;
      if (decreaseOption === "100") {
        sizeAfter = 0;
        collateralAfter = 0;
      } else if (decreaseOption !== "Custom" && decreaseOption !== "") {
        const decreasePercentage = parseFloat(decreaseOption) / 100;
        sizeAfter = position.size * (1 - decreasePercentage);
        collateralAfter = position.collateral * (1 - decreasePercentage);
      } else if (customSizeDelta !== "") {
        sizeAfter = position.size - parseFloat(customSizeDelta);
        const decreasePercentage = parseFloat(customDecreasePercentage) / 100;
        collateralAfter = position.collateral * (1 - decreasePercentage);
      } else if (customDecreasePercentage !== "") {
        const decreasePercentage = parseFloat(customDecreasePercentage) / 100;
        sizeAfter = position.size * (1 - decreasePercentage);
        collateralAfter = position.collateral * (1 - decreasePercentage);
      } else {
        // No valid input, size remains the same
        sizeAfter = position.size;
        collateralAfter = position.collateral;
      }

      setSizesAfter({
        sizeAfter,
        collateralAfter,
      });
    };
    calculateSizesAfter();
  }, [
    position.size,
    decreaseOption,
    customSizeDelta,
    customDecreasePercentage,
  ]);

  const priceDecimals = useMemo(() => {
    const newDecimals = getPriceDecimals(markPrice);
    if (newDecimals !== lastCalculatedDecimals.current) {
      lastCalculatedDecimals.current = newDecimals;
      return newDecimals;
    }
    return lastCalculatedDecimals.current;
  }, [markPrice]);

  const isButtonDisabled = useMemo(() => {
    if (activeType === "Stop Loss" && hasStopLoss) {
      return true;
    }
    if (activeType === "Take Profit" && hasTakeProfit) {
      return true;
    }
    if (
      decreaseOption !== "100" &&
      customDecreasePercentage !== "100" &&
      sizesAfter.collateralAfter < 2
    ) {
      return true;
    }

    let totalFees =
      closingFees.borrowFee +
      fees.positionFee +
      fees.executionFee +
      fees.priceUpdateFee;

    if (position.isLong) {
      totalFees += closingFees.fundingFee;
    } else {
      totalFees -= closingFees.fundingFee;
    }

    totalFees -= Number(pnl.replace("$", ""));

    const collateralDelta =
      position.collateral * (parseFloat(decreaseOption) / 100);

    return collateralDelta < totalFees;
  }, [
    activeType,
    hasStopLoss,
    hasTakeProfit,
    decreaseOption,
    customDecreasePercentage,
    sizesAfter.collateralAfter,
    closingFees,
    fees,
    pnl,
    position.isLong,
    position.collateral,
  ]);

  const getButtonText = () => {
    if (activeType === "Stop Loss") {
      if (hasStopLoss) {
        return "Stop Loss already Set";
      }
      return "Set Stop Loss";
    }
    if (activeType === "Take Profit") {
      if (hasTakeProfit) {
        return "Take Profit already Set";
      }
      return "Set Take Profit";
    }
    if (
      decreaseOption !== "100" &&
      customDecreasePercentage !== "100" &&
      sizesAfter.collateralAfter < 2
    ) {
      return "Min Collateral $2";
    }

    let totalFees =
      closingFees.borrowFee +
      fees.positionFee +
      fees.executionFee +
      fees.priceUpdateFee;

    if (position.isLong) {
      totalFees += closingFees.fundingFee;
    } else {
      totalFees -= closingFees.fundingFee;
    }

    // Subtract PNL (negative pnl should increase fees, and positive pnl decrease)
    totalFees -= Number(pnl.replace("$", ""));

    const collateralDelta =
      position.collateral * (parseFloat(decreaseOption) / 100);

    if (collateralDelta < totalFees) {
      return "Collateral Delta Must Exceed Fees";
    }
    return "Close Position";
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row p-4 lg:gap-10">
      <div className="w-full lg:w-1/2 h-full flex flex-col gap-4 mb-8 lg:mb-0">
        <div className="lg:hidden w-full flex items-center justify-between">
          <p className="text-xl font-medium">
            Decrease Position:{" "}
            <span className="text-printer-orange font-bold">
              {position.symbol.split(":")[0]} / USD{" "}
            </span>
            <span
              className={`text-sm  ${
                position.isLong ? "text-printer-green" : "text-printer-red"
              }`}
            >{`${position.isLong ? "Long" : "Short"}`}</span>
          </p>
          <ModalClose onClose={onClose} />
        </div>
        <p className="text-xl font-medium hidden lg:block">
          Decrease Position:{" "}
          <span className="text-printer-orange font-bold">
            {position.symbol.split(":")[0]} / USD{" "}
          </span>
          <span
            className={`text-sm  ${
              position.isLong ? "text-printer-green" : "text-printer-red"
            }`}
          >{`${position.isLong ? "Long" : "Short"}`}</span>
        </p>
        <TypeButtons
          activeType={activeType}
          setActiveType={setActiveType}
          isEntry={false}
        />
        {activeType === "Market" ? (
          <InputField
            readOnly={true}
            value={markPrice.toFixed(priceDecimals)}
            className="mt-2"
            placeHolder="0.0"
            renderTitle={
              <label className="block text-printer-gray text-xs">
                Trigger Price
              </label>
            }
          />
        ) : (
          <div className="flex flex-col gap-2">
            <InputField
              readOnly={false}
              value={limitPrice.toString()}
              onChange={handleLimitPriceChange}
              className="mt-2"
              placeHolder="0.0"
              renderTitle={
                <label className="block text-printer-gray text-xs">
                  Trigger Price
                </label>
              }
            />
            <div className="flex flex-row items-center w-full justify-between py-1">
              <p className="text-[15px] text-gray-text">
                Trigger when mark price
              </p>
              <p className="text-[15px] text-white">{`${
                activeType === "Stop Loss"
                  ? position.isLong
                    ? "≤"
                    : "≥"
                  : position.isLong
                  ? "≥"
                  : "≤"
              } $${parseFloat(limitPrice).toFixed(priceDecimals)}`}</p>
            </div>
          </div>
        )}

        {/** Divider */}
        <div className="w-full h-px bg-gray-text"> </div>
        {/** Divider */}

        <div className="flex flex-col gap-2">
          <div className="flex flex-row w-full justify-between items-center">
            <p className="text-sm text-white">Closing Size</p>
            <p className="text-sm text-gray-text">{`Maximum closing size: $${position.size.toFixed(
              2
            )}`}</p>
          </div>
          <div className="flex justify-between items-center w-full bg-input-grad border-cardborder border-3 p-4">
            <NumberInput
              onValueChange={(value: string) =>
                handleCustomSizeDeltaChange(value)
              }
              value={customSizeDelta}
              placeholder=""
              className="text-sm text-printer-gray  md:text-lg font-medium focus:outline focus:outline-none bg-transparent text-left overflow-x-hidden"
            />
            <div className="flex flex-row gap-4 items-center justify-between">
              <button
                className="flex items-center justify-center text-center text-xs bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 text-white font-bold px-3 py-1 shadow-[4px_4px_10px_rgba(0,0,0,0.3)] ml-2"
                onClick={handleMaxClick}
              >
                MAX
              </button>
              <div className="border-1 border-white rounded-full py-1 px-2">
                USD
              </div>
            </div>
          </div>
        </div>

        <PercentageButtons
          title="Decrease Percentage"
          options={decreasePercentageOptions}
          isLong={position.isLong}
          selectedOption={decreaseOption}
          setSelectedOption={setDecreaseOption}
          customValue={customDecreasePercentage}
          setCustomValue={setCustomDecreasePercentage}
        />
        <PercentageButtons
          title="Max Slippage"
          options={slippageOptions}
          isLong={position.isLong}
          selectedOption={selectedSlippage}
          setSelectedOption={setSelectedSlippage}
          customValue={customSlippage}
          setCustomValue={setCustomSlippage}
        />
        {collateralType === "ETH" && (
          <div className="flex flex-row justify-between items-center my-4">
            <ToggleSwitch
              value={unwrap}
              setValue={setUnwrap}
              label="Unwrap Ether"
            />
            <div className="flex flex-row gap-2 items-center">
              <p className="text-gray-text text-base">Receive: </p>
              <Image
                src={
                  unwrap
                    ? getImageUrlFromTokenSymbol("ETH")
                    : getImageUrlFromTokenSymbol("WETH")
                }
                alt="token logo"
                width={24}
                height={24}
              />
            </div>
          </div>
        )}
        <div className="w-full h-px bg-gray-text my-4" />
      </div>

      <div className="w-full lg:w-1/2 lg:h-full pb-24 md:pb-0 py-2 lg:py-0 lg:p-4 flex flex-col justify-between items-stretch gap-4">
        <div className="hidden w-full lg:flex items-start justify-end">
          <ModalClose onClose={onClose} />
        </div>
        <div className="flex flex-col gap-2 py-4">
          <InfoRow
            label="Entry Price"
            value={`$${position.entryPrice.toFixed(priceDecimals)}`}
          />
          <InfoRow
            label="Mark Price"
            value={`$${markPrice.toFixed(priceDecimals)}`}
          />
          <InfoRow
            label="Liquidation Price"
            value={`$${position.liqPrice.toFixed(priceDecimals)}`}
          />
          <div className="w-full h-px bg-gray-text" />
          <InfoRowWithDelta
            label="Position Size"
            valueBefore={`${position.size.toFixed(2)} USD`}
            valueAfter={`${sizesAfter.sizeAfter.toFixed(2)} USD`}
            valueColour="text-printer-red"
            arrowColour="text-printer-red"
          />
          <InfoRow
            label="Collateral Asset"
            value={position.isLong ? "ETH" : "USDC"}
          />
          <InfoRowWithDelta
            label="Collateral Value"
            valueBefore={`${position.collateral.toFixed(2)} USD`}
            valueAfter={`${sizesAfter.collateralAfter.toFixed(2)} USD`}
            valueColour="text-printer-red"
            arrowColour="text-printer-red"
          />
          <InfoRow
            label="Leverage"
            value={`${(position.size / position.collateral).toFixed(2)}x`}
          />
          <div className="w-full h-px bg-gray-text" />
          <InfoRow
            label="Estimated PNL"
            value={pnl}
            valueColour={hasProfit ? "printer-green" : "printer-red"}
          />
          <InfoRow
            label="Borrow Fee"
            value={`$${formatSmallNumber(closingFees.borrowFee)}`}
          />
          <InfoRow
            label="Funding Fee"
            value={`${
              (position.isLong
                ? -closingFees.fundingFee
                : closingFees.fundingFee) >= 0
                ? "+$"
                : "-$"
            }${formatSmallNumber(
              Math.abs(
                position.isLong
                  ? -closingFees.fundingFee
                  : closingFees.fundingFee
              )
            )}`}
            valueColour={
              (position.isLong
                ? -closingFees.fundingFee
                : closingFees.fundingFee) >= 0
                ? "printer-green"
                : "printer-red"
            }
          />
          <InfoRow
            label="Price Impact"
            value={`$${formatSmallNumber(closingFees.priceImpact)}`}
            tooltip={
              position.isLong
                ? closingFees.priceImpact > 0
                  ? `Your position's mark price will be positively impacted by ${closingFees.priceImpact} USD.`
                  : `Your position's mark price will be negatively impacted by ${
                      closingFees.priceImpact * -1
                    } USD.`
                : closingFees.priceImpact > 0
                ? `Your position's mark price will be negatively impacted by ${closingFees.priceImpact} USD.`
                : `Your position's mark price will be positively impacted by ${
                    closingFees.priceImpact * -1
                  } USD.`
            }
          />
          <div className="w-full h-px bg-gray-text" />
          <FeesInfo
            positionFee={fees.positionFee}
            executionFee={fees.executionFee}
            priceUpdateFee={fees.priceUpdateFee}
          />
          <div className="w-full h-px bg-gray-text" />
          <div className="flex flex-row justify-between text-sm text-gray-text py-4">
            <span>Receive</span>
            <div className="flex flex-col gap-2 items-end">
              <span className="text-white textfont-medium">{`${
                receiveAmounts.tokenAmount
              } ${position.isLong ? "ETH" : "USDC"}`}</span>
              <span>{`$${receiveAmounts.usdAmount.toFixed(2)}`}</span>
            </div>
          </div>
        </div>
        <div className="py-4">
          <Button
            onPress={() => {}}
            disabled={isButtonDisabled}
            className={`w-full flex items-center justify-center text-center text-base bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 text-white py-6 font-bold ${
              isButtonDisabled ? "cursor-not-allowed" : ""
            }`}
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DecreasePosition;
