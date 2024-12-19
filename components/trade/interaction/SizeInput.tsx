"use client";

import React, { useCallback, useEffect, useState } from "react";
import EntryStats from "./EntryStats";
import EntryButton from "./EntryButton";
import ToggleSwitch from "@/components/common/ToggleSwitch";
import LeverageButtons from "./leverage/LeverageButtons";
import LeverageSlider from "./leverage/LeverageSlider";
import TriggerButtons from "./leverage/TriggerButtons";
import Image from "next/image";
import { useAsset } from "../assets/AssetContext";
import CustomSelect from "./CustomSelect";
import {
  getImageForToken,
  getImageUrlfromTokenSymbol,
} from "@/lib/utils/getTokenImage";
import InputField from "@/components/common/InputField";

interface SizeInputProps {
  isLong: boolean;
  activeType: string;
  leverage: number;
  setLeverage: (value: number) => void;
  collateral: string;
  setCollateral: (value: string) => void;
  markPrice: number;
  liqPrice: number;
  priceDecimals: number;
  forDummyBox?: boolean;
  triggerRefetchPositions: () => void;
  marketStats: {
    borrowRateLong: number;
    borrowRateShort: number;
    fundingRate: number;
    fundingRateVelocity: number;
    availableLiquidityLong: number;
    availableLiquidityShort: number;
    openInterestLong: number;
    openInterestShort: number;
  };
  triggerRefreshVolume: () => void;
  updateMarketStats: () => void;
  createPendingPosition: (position: Position) => void;
  refreshPendingPosition: (id: string, success: boolean) => void;
}

const SizeInput: React.FC<SizeInputProps> = ({
  isLong,
  activeType,
  leverage,
  setLeverage,
  collateral,
  setCollateral,
  markPrice,
  liqPrice,
  priceDecimals,
  forDummyBox,
  triggerRefetchPositions,
  marketStats,
  triggerRefreshVolume,
  updateMarketStats,
  createPendingPosition,
  refreshPendingPosition,
}) => {
  const { asset } = useAsset();

  const [total, setTotal] = useState(0);

  const [useSlider, setUseSlider] = useState(false);

  const [collateralType, setCollateralType] = useState("ETH");

  const [limitPrice, setLimitPrice] = useState<string>("");

  const [balance, setBalance] = useState<string>("0");

  const [collateralPrice, setCollateralPrice] = useState(0);

  const [usdValue, setUsdValue] = useState(0);

  const [equivalentAsset, setEquivalentAsset] = useState(0);

  const [stopLossEnabled, setStopLossEnabled] = useState(false);

  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false);

  const [stopLossPercentage, setStopLossPercentage] = useState<string>("0");

  const [takeProfitPercentage, setTakeProfitPercentage] = useState<string>("0");

  const [stopLossPrice, setStopLossPrice] = useState<string>("0");

  const [takeProfitPrice, setTakeProfitPrice] = useState<string>("0");

  const [priceImpact, setPriceImpact] = useState(0);

  const [impactedPrice, setImpactedPrice] = useState(0);

  const [positionFee, setPositionFee] = useState(0);

  const [showTriggers, setShowTriggers] = useState({
    showLong: false,
    showShort: false,
  });

  const [executionFees, setExecutionFees] = useState<{
    executionFee: number;
    priceUpdateFee: number;
  }>({
    executionFee: 0,
    priceUpdateFee: 0,
  });

  const [leveragedValueUsd, setLeveragedValueUsd] = useState(0);

  // Used to cache prices so they're not refetched constantly when calculating equivalents
  const [cachedPrices, setCachedPrices] = useState<{
    ethPrice: number;
    usdcPrice: number;
  }>({
    ethPrice: 0,
    usdcPrice: 0,
  });

  const collateralOptions = isLong ? ["ETH", "WETH"] : ["USDC"];

  const resetInputs = async () => {
    setCollateral("");
    setLeverage(1.1);
    setLimitPrice("0");
    setStopLossPercentage("0");
    setTakeProfitPercentage("0");
    setStopLossPrice("0");
    setTakeProfitPrice("0");
  };

  useEffect(() => {
    const updateLeveragedValue = async () => {
      const val = (parseFloat(collateral) || 0) * leverage * collateralPrice;
      setLeveragedValueUsd(val);
    };

    updateLeveragedValue();
  }, [collateral, leverage, collateralPrice]);

  useEffect(() => {
    setCollateralType(isLong ? "ETH" : "USDC");
    resetInputs();
  }, [isLong]);

  useEffect(() => {
    setStopLossPrice(markPrice.toString());
  }, [stopLossEnabled]);

  useEffect(() => {
    setTakeProfitPrice(markPrice.toString());
  }, [takeProfitEnabled]);

  useEffect(() => {
    setLimitPrice(markPrice.toString());
  }, [activeType]);

  useEffect(() => {
    const collateralInNumber = parseFloat(collateral) || 0;
    setUsdValue(collateralInNumber * collateralPrice);
    setEquivalentAsset(
      calculateEquivalentAsset(collateralInNumber, leverage, markPrice || 1)
    );
  }, [collateral, leverage, collateralPrice, asset]);

  const calculateTotalUsd = (
    collateral: number,
    leverage: number,
    collateralPrice: number
  ) => {
    return collateral * leverage * collateralPrice;
  };

  const calculateEquivalentAsset = (
    collateral: number,
    leverage: number,
    assetPrice: number
  ) => {
    return (collateral * leverage * collateralPrice) / assetPrice;
  };

  const handleCollateralChange = (value: string) => {
    setCollateral(value);
  };

  const handleLeverageChange = (value: number) => {
    setLeverage(value);
    // Remove the immediate call to getPriceImpact here
    // The debounced function will handle it
  };

  const handleCollateralTypeChange = (selectedType: string) => {
    if (isLong && (selectedType === "ETH" || selectedType === "WETH")) {
      setCollateralType(selectedType);
    } else if (!isLong && selectedType === "USDC") {
      setCollateralType(selectedType);
    }
  };

  const handleMaxClick = () => {
    setCollateral(balance);
  };

  // When Mark price is clicked, set the limit price to the mark price
  const handleMarkPriceClick = () => {
    setLimitPrice(markPrice.toString());
  };

  const handleLimitPriceChange = (value: string) => {
    setLimitPrice(value);
  };

  const handleStopLossChange = (value: string) => {
    setStopLossPercentage(value);
  };

  const handleTakeProfitChange = (value: string) => {
    setTakeProfitPercentage(value);
  };

  const handleStopLossPriceChange = (value: string) => {
    setStopLossPrice(value);
  };

  const handleTakeProfitPriceChange = (value: string) => {
    setTakeProfitPrice(value);
  };

  return (
    <div
      className={`flex flex-col gap-4 rounded-lg  ${forDummyBox ? "mt-4" : ""}`}
    >
      <InputField
        readOnly={false}
        value={collateral}
        onChange={handleCollateralChange}
        className="mt-2"
        placeHolder="0.0"
        renderContent={
          <div className="flex flex-row w-full justify-end items-center gap-2">
            {isLong ? (
              <>
                <Image
                  src={getImageUrlfromTokenSymbol(collateralType)}
                  alt={collateralType}
                  width={24}
                  height={24}
                />
                <CustomSelect
                  options={collateralOptions}
                  selectedOption={collateralType}
                  onOptionSelect={handleCollateralTypeChange}
                  showImages={true}
                  showText={false}
                />
              </>
            ) : (
              <div className="flex items-center gap-2 bg-transparent rounded text-printer-gray font-bold">
                <Image
                  src={getImageUrlfromTokenSymbol("USDC")}
                  alt="USDC"
                  width={24}
                  height={24}
                />
                <span>USDC</span>
              </div>
            )}
          </div>
        }
        renderBalance={
          <p className="font-normal text-xs trade-second-step">
            Balance :{" "}
            <span className="font-medium">
              {balance ? parseFloat(balance).toFixed(4) : 0}
            </span>
          </p>
        }
        renderTitle={
          <label className="flex flex-row items-center text-printer-gray text-xs">
            <span>
              Pay: ${usdValue.toFixed(2)}{" "}
              <span className="text-xxs">(+${positionFee.toFixed(2)} Fee)</span>
            </span>
          </label>
        }
        setMax={handleMaxClick}
      />
      <div
        className={`flex justify-between items-center trade-fourth-step ${
          activeType === "Market" ? "mb-4" : ""
        } py-5 px-3 bg-input-grad border-cardborder border-2 rounded-lg`}
      >
        <div>
          <label className="block text-printer-gray text-xs mb-2">
            {isLong ? "Long" : "Short"}: ${leveragedValueUsd.toFixed(2)}
          </label>
          <div className="text-white text-lg">{equivalentAsset.toFixed(2)}</div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row text-printer-gray text-xs gap-2 mb-2">
            <span>Leverage:</span>
            <span className="font-bold">{leverage.toFixed(2)}x</span>
          </div>
          <div className="flex flex-row w-full justify-end items-center gap-2">
            {asset ? (
              <>
                <img
                  src={getImageForToken(asset)}
                  alt={asset.symbol}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="font-bold text-lg  text-printer-gray">
                  {asset.symbol}
                </span>
              </>
            ) : (
              <>
                <div className="rounded-full w-6 h-6 animate-pulse bg-loading"></div>
                <div className="h-4 w-4 animate-pulse bg-loading"></div>
              </>
            )}
          </div>
        </div>
      </div>
      {activeType !== "Market" && (
        <InputField
          value={limitPrice.toString()}
          onChange={handleLimitPriceChange}
          hideMax={true}
          placeHolder="0.0"
          renderTitle={<label className="block text-printer-gray">Price</label>}
          renderContent={
            <div className="flex flex-col">
              <div
                className="flex flex-row text-printer-gray text-xs gap-2 mb-2 cursor-pointer hover:text-gray-text"
                onClick={handleMarkPriceClick}
              >
                <span>Mark Price:</span>
                <span className="font-bold">{`$${markPrice.toFixed(
                  priceDecimals
                )}`}</span>
              </div>
              <div className="flex flex-row w-full justify-end items-center gap-2">
                {asset ? (
                  <>
                    <img
                      src={getImageForToken(asset)}
                      alt={asset.symbol}
                      width={24}
                      height={24}
                    />
                    <span className="font-bold text-lg text-printer-gray">
                      {asset.symbol}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="rounded-full w-6 h-6 animate-pulse bg-loading"></div>
                    <div className="h-4 w-4 animate-pulse bg-loading"></div>
                  </>
                )}
              </div>
            </div>
          }
        />
      )}
      <div className="flex justify-between items-center">
        <label className="block text-gray-400 text-[15px] mb-2">
          <span className="text-gray-text">Leverage</span> Up to{" "}
          <span className="font-bold">{asset ? asset.leverage : "..."}x</span>
        </label>
        <ToggleSwitch
          value={useSlider}
          setValue={setUseSlider}
          label="Slider"
        />
      </div>
      <div className="h-10 mb-2">
        {useSlider ? (
          <LeverageSlider
            min={1.1}
            max={asset ? asset.leverage : 1.1}
            step={0.1}
            initialValue={1.1}
            onChange={handleLeverageChange}
            isLongPosition={isLong}
            unit="x"
          />
        ) : (
          <LeverageButtons
            onChange={(event) =>
              handleLeverageChange(Number(event.target.value))
            }
            maxLeverage={asset ? asset.leverage : 1.1}
            isLongPosition={isLong}
          />
        )}
      </div>
      {forDummyBox ? (
        <></>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {((showTriggers.showLong && isLong) ||
              (showTriggers.showShort && !isLong)) && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[15px]">Stop Loss</span>
                  <ToggleSwitch
                    value={stopLossEnabled}
                    setValue={setStopLossEnabled}
                    label=""
                  />
                </div>
                {stopLossEnabled && (
                  <TriggerButtons
                    onChange={handleStopLossChange}
                    onPriceChange={handleStopLossPriceChange}
                    isLongPosition={isLong}
                    customPrice={stopLossPrice}
                    setCustomPrice={setStopLossPrice}
                  />
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-[15px]">Take Profit</span>
                  <ToggleSwitch
                    value={takeProfitEnabled}
                    setValue={setTakeProfitEnabled}
                    label=""
                  />
                </div>
                {takeProfitEnabled && (
                  <TriggerButtons
                    onChange={handleTakeProfitChange}
                    onPriceChange={handleTakeProfitPriceChange}
                    isLongPosition={isLong}
                    customPrice={takeProfitPrice}
                    setCustomPrice={setTakeProfitPrice}
                  />
                )}
              </>
            )}
          </div>
          <EntryStats
            collateralIn={parseFloat(collateral)}
            leverage={leverage}
            entryPrice={markPrice}
            liqPrice={liqPrice}
            priceImpact={priceImpact}
            priceDecimals={priceDecimals}
            availableLiquidity={
              isLong
                ? marketStats.availableLiquidityLong
                : marketStats.availableLiquidityShort
            }
            positionFee={positionFee}
            executionFee={executionFees.executionFee * cachedPrices.ethPrice}
            priceUpdateFee={
              executionFees.priceUpdateFee * cachedPrices.ethPrice
            }
          />
          <EntryButton
            marketId={asset?.marketId || "0x3333"}
            isLong={isLong}
            isLimit={activeType === "Limit"}
            isTrigger={activeType === "Trigger"}
            ticker={asset?.customId || "BTC:1"}
            leverage={leverage}
            collateralToken={collateralType as `0x${string}`}
            collateralDelta={parseFloat(collateral)}
            collateralDeltaUsd={usdValue}
            sizeDelta={leveragedValueUsd || 0}
            limitPrice={parseFloat(limitPrice)}
            isIncrease={true}
            reverseWrap={collateralType === "ETH"}
            stopLossSet={stopLossEnabled}
            takeProfitSet={takeProfitEnabled}
            stopLossPercentage={parseFloat(stopLossPercentage)}
            takeProfitPercentage={parseFloat(takeProfitPercentage)}
            stopLossPrice={parseFloat(stopLossPrice)}
            takeProfitPrice={parseFloat(takeProfitPrice)}
            entryPrice={markPrice || 0}
            positionFee={positionFee}
            executionFees={executionFees}
            liqPrice={liqPrice}
            priceImpact={priceImpact}
            collateralPrices={cachedPrices}
            triggerRefetchPositions={triggerRefetchPositions}
            resetInputs={resetInputs}
            fetchExecutionFees={() => {}}
            triggerRefreshVolume={triggerRefreshVolume}
            updateMarketStats={updateMarketStats}
            createPendingPosition={createPendingPosition}
            refreshPendingPosition={refreshPendingPosition}
          />
        </>
      )}
    </div>
  );
};

export default SizeInput;
