import ModalClose from "@/components/common/ModalClose";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@nextui-org/react";
import TypeButton from "../interaction/TypeButton";
import { PiArrowDownFill, PiArrowRightFill } from "react-icons/pi";
import Image from "next/image";
import InfoTip from "@/app/assets/common/info-tip.svg";
import SlippageDropdown from "../interaction/SlippageDropdown";
import CollateralInput from "../interaction/CollateralInput";
import { getPriceDecimals } from "@/lib/web3/formatters";

const MIN_COLLATERAL_USD = 2;
const MAX_LEVERAGE = 1000;

const CollateralEdit = ({
  isDeposit,
  onClose,
  marketId,
  position,
  triggerRefetchPositions,
  markPrice,
}: {
  isDeposit: boolean;
  onClose: () => void;
  marketId: `0x${string}`;
  position: Position;
  triggerRefetchPositions: () => void;
  markPrice: number;
}) => {
  const [balance, setBalance] = useState("");

  const [collateral, setCollateral] = useState("");

  const [collateralType, setCollateralType] = useState("ETH");

  const [liqPriceAfter, setLiqPriceAfter] = useState(0);

  const [isValidWithdrawal, setIsValidWithdrawal] = useState(true);

  const lastCalculatedDecimals = useRef(30);

  const [leverages, setLeverages] = useState<{
    leverageBefore: number;
    leverageAfter: number;
  }>({
    leverageBefore: 0,
    leverageAfter: 0,
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

  // Used to handle conversions between value and token amounts
  const [equivalents, setEquivalents] = useState<{
    value: number;
    tokens: number;
  }>({
    value: 0,
    tokens: 0,
  });

  // Used to cache prices so they're not refetched constantly when calculating equivalents
  const [cachedPrices, setCachedPrices] = useState<{
    ethPrice: number;
    usdcPrice: number;
  }>({
    ethPrice: 0,
    usdcPrice: 0,
  });

  const [collateralPrice, setCollateralPrice] = useState(0);

  // Max Slippage
  const [selectedOption, setSelectedOption] = useState<string>("0.3");
  const [customValue, setCustomValue] = useState<string>("");

  const [isTransactionPendingModalOpen, setIsTransactionPendingModalOpen] =
    useState(false);

  const [currentStep, setCurrentStep] = useState(0);

  const [hasFailedAtCurrentStep, setHasFailedAtCurrentStep] = useState(false);

  const [isTransactionComplete, setIsTransactionComplete] = useState(false);

  const [isValidLeverage, setIsValidLeverage] = useState(true);
  const [leverageErrorMessage, setLeverageErrorMessage] = useState("");

  const [maxWithdrawable, setMaxWithdrawable] = useState(0);

  const longCollateralOptions = ["ETH", "WETH"];

  const slippageOptions = ["0.1", "0.3", "0.5", "1"];

  const handleCollateralChange = (value: string) => {
    setCollateral(value);

    if (!isDeposit) {
      const withdrawalAmountUsd = parseFloat(value) * collateralPrice;
      const remainingCollateralUsd = position.collateral - withdrawalAmountUsd;
      setIsValidWithdrawal(remainingCollateralUsd >= MIN_COLLATERAL_USD);
    }
  };

  const handleCollateralTypeChange = (option: string) => {
    if (position.isLong && (option === "ETH" || option === "WETH")) {
      setCollateralType(option);
    }
  };

  const handleMaxClick = () => {
    if (isDeposit) {
      setCollateral(balance);
    } else {
      setCollateral(maxWithdrawable.toString());
    }
  };

  const resetInputs = () => {
    setCollateral("");
    setSelectedOption("0.3");
    setCustomValue("");
  };

  // Check whether leverage after is within boundaries
  useEffect(() => {
    const checkLeverageBoundaries = () => {
      if (equivalents.value === 0) {
        setIsValidLeverage(true);
        setLeverageErrorMessage("");
        return;
      }

      let newLeverage;
      if (isDeposit) {
        newLeverage = position.size / (position.collateral + equivalents.value);
      } else {
        newLeverage = position.size / (position.collateral - equivalents.value);
      }

      if (newLeverage < 1.1) {
        setIsValidLeverage(false);
        setLeverageErrorMessage("Min Leverage 1.1x");
      } else if (newLeverage > MAX_LEVERAGE) {
        setIsValidLeverage(false);
        setLeverageErrorMessage(`Max Leverage ${MAX_LEVERAGE}x`);
      } else {
        setIsValidLeverage(true);
        setLeverageErrorMessage("");
      }
    };

    checkLeverageBoundaries();
  }, [
    equivalents.value,
    position.size,
    position.collateral,
    MAX_LEVERAGE,
    isDeposit,
  ]);

  useEffect(() => {
    setCollateralType(position.isLong ? "ETH" : "USDC");
  }, [position.isLong]);

  useEffect(() => {
    const fetchLeverages = async () => {
      const leverageBefore = (position.size / position.collateral).toFixed(2);
      let leverageAfter;
      if (equivalents.value === 0) {
        leverageAfter = leverageBefore;
      } else {
        if (isDeposit) {
          leverageAfter = (
            position.size /
            (position.collateral + equivalents.value)
          ).toFixed(2);
        } else {
          leverageAfter = (
            position.size /
            (position.collateral - equivalents.value)
          ).toFixed(2);
        }
      }
      setLeverages({
        leverageBefore: parseFloat(leverageBefore),
        leverageAfter: parseFloat(leverageAfter),
      });
    };

    fetchLeverages();
  }, [collateral, equivalents.value, position.collateral, position.size]);

  const priceDecimals = useMemo(() => {
    const newDecimals = getPriceDecimals(markPrice);
    if (newDecimals !== lastCalculatedDecimals.current) {
      lastCalculatedDecimals.current = newDecimals;
      return newDecimals;
    }
    return lastCalculatedDecimals.current;
  }, [markPrice]);

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      <div className="flex flex-row w-full justify-between">
        <p className="text-xl font-bold">
          {isDeposit ? "Deposit Collateral" : "Withdraw Collateral"}
        </p>
        <ModalClose onClose={onClose} />
      </div>
      <div className="flex flex-row w-full items-center justify-between">
        <TypeButton
          type={isDeposit ? "Deposit" : "Withdraw"}
          isActive={true}
          onClick={() => {}}
        />
        <p className="text-sm text-base-gray">
          {isDeposit ? "My wallet balance:" : "Max Withdraw:"}{" "}
          <span className="font-bold">{`${
            isDeposit
              ? parseInt(balance).toFixed(position.isLong ? 4 : 2)
              : maxWithdrawable.toFixed(position.isLong ? 8 : 4)
          } ${collateralType}`}</span>
        </p>
      </div>
      <CollateralInput
        value={collateral}
        onValueChange={handleCollateralChange}
        collateralType={collateralType}
        onCollateralTypeChange={handleCollateralTypeChange}
        collateralOptions={longCollateralOptions}
        onMaxClick={handleMaxClick}
        showSelectCurrency={position.isLong}
      />
      <div className="flex flex-col gap-2 py-6">
        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Position Size</span>
          <span>{`$${position.size.toFixed(2)}`}</span>
        </div>

        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Collateral Asset</span>
          <span>{position.isLong ? "ETH" : "USDC"}</span>
        </div>

        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Collateral Value</span>
          <p
            className={`${
              isDeposit ? "text-printer-green" : "text-printer-red"
            } text-nowrap flex items-center`}
          >
            <span className="text-gray-text">{`$${position.collateral.toFixed(
              2
            )}`}</span>
            <PiArrowRightFill className="mx-1" />
            <span>{`$${(isDeposit
              ? position.collateral + equivalents.value
              : position.collateral - equivalents.value
            ).toFixed(2)}`}</span>
          </p>
        </div>

        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Leverage</span>
          <p
            className={`${
              isDeposit ? "text-printer-green" : "text-printer-red"
            } text-nowrap flex items-center`}
          >
            <span className="text-gray-text">{leverages.leverageBefore}</span>
            <PiArrowRightFill className="mx-1" />
            <span>{leverages.leverageAfter}</span>
          </p>
        </div>

        <div className="flex flex-row items-stretch justify-between text-sm text-gray-text">
          <span className="flex flex-col justify-between text-wrap">
            <span>Current Liquidation Price</span>
            <PiArrowDownFill className="my-1" />
            <span>New Liquidation Price</span>
          </span>
          <p
            className={`${
              isDeposit ? "text-printer-green" : "text-printer-red"
            } flex flex-col items-end justify-between`}
          >
            <span className="text-gray-text">{`$${position.liqPrice.toFixed(
              priceDecimals
            )}`}</span>
            <PiArrowDownFill className="my-1" />
            <span>{`$${liqPriceAfter.toFixed(priceDecimals)}`}</span>
          </p>
        </div>

        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Position Fee</span>
          <span>{fees.positionFee}</span>
        </div>
        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Execution Fee</span>
          <span>{`${fees.executionFee} ETH`}</span>
        </div>
        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Price Update Fee</span>
          <span>{`${fees.priceUpdateFee.toFixed(18)} ETH`}</span>
        </div>
        <div className="flex flex-row justify-between items-center text-sm text-gray-text">
          <span>Slippage</span>
          <SlippageDropdown
            options={slippageOptions}
            selectedOption={selectedOption}
            onOptionSelect={setSelectedOption}
          />
        </div>
        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Mark Price</span>
          <span>{`$${markPrice.toFixed(priceDecimals)}`}</span>
        </div>
      </div>
      <div className="flex flex-row justify-between text-sm text-gray-text gap-4 items-center">
        <Image src={InfoTip} alt="Info Tip" width={24} height={24} />
        <p className="text-xs text-printer-gray">
          Depositing collateral helps to reduce the risk of your positon being
          liquidated by decreasing the liq price.
        </p>
      </div>
      <div className="py-4 pb-24 md:pb-0">
        <Button
          onPress={() => {}}
          disabled={
            (!isDeposit && !isValidWithdrawal) ||
            !isValidLeverage ||
            parseFloat(collateral) > parseFloat(balance)
          }
          className={`w-full flex items-center justify-center text-center text-base bg-p3-button hover:bg-p3-button-hover ${
            (!isDeposit && !isValidWithdrawal) ||
            !isValidLeverage ||
            parseFloat(collateral) > parseFloat(balance)
              ? "cursor-not-allowed"
              : ""
          } border-2 border-p3 !rounded-3 text-white py-4 font-bold`}
        >
          {isDeposit
            ? isValidLeverage
              ? "Deposit"
              : leverageErrorMessage
            : isValidWithdrawal
            ? isValidLeverage
              ? "Withdraw"
              : leverageErrorMessage
            : "Min Collateral 2 USD"}
        </Button>
      </div>
    </div>
  );
};

export default CollateralEdit;
