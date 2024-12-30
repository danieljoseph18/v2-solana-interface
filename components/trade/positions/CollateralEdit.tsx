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
import {
  estimateLiquidationPrice,
  preCalculateLiquidationPrice,
} from "@/lib/web3/position/estimateLiquidationPrice";
import { useWallet } from "@/hooks/useWallet";
import { helperToast } from "@/lib/helperToast";
import { fetchCollateralPrices } from "@/app/actions/fetchCollateralPrices";
import { getBalance } from "@/app/actions/margin";

const CollateralEdit = ({
  isDeposit,
  onClose,
  position,
  markPrice,
}: {
  isDeposit: boolean;
  onClose: () => void;
  position: Position;
  markPrice: number;
}) => {
  const { address, balances } = useWallet();

  const [collateral, setCollateral] = useState("");

  const [collateralType, setCollateralType] = useState("SOL");

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

  const [positionFee, setPositionFee] = useState(0);

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
    solPrice: number;
    usdcPrice: number;
  }>({
    solPrice: 0,
    usdcPrice: 0,
  });

  const [collateralPrice, setCollateralPrice] = useState(0);

  // Max Slippage
  const [selectedOption, setSelectedOption] = useState<string>("0.3");

  const [isValidLeverage, setIsValidLeverage] = useState(true);
  const [leverageErrorMessage, setLeverageErrorMessage] = useState("");

  const [maxWithdrawable, setMaxWithdrawable] = useState(0);

  const longCollateralOptions = ["SOL", "USDC"];

  const slippageOptions = ["0.1", "0.3", "0.5", "1"];

  const handleCollateralChange = (value: string) => {
    setCollateral(value);

    if (!isDeposit) {
      const withdrawalAmountUsd = parseFloat(value) * collateralPrice;
      const remainingCollateralUsd = position.margin - withdrawalAmountUsd;
      setIsValidWithdrawal(remainingCollateralUsd > 0);
    }
  };

  const handleCollateralTypeChange = (option: string) => {
    setCollateralType(option);
  };

  const handleMaxClick = () => {
    if (isDeposit) {
      collateralType === "SOL"
        ? setCollateral(balances.solBalance.toString())
        : setCollateral(balances.usdcBalance.toString());
    } else {
      setCollateral(maxWithdrawable.toString());
    }
  };

  const resetInputs = () => {
    setCollateral("");
    setSelectedOption("0.3");
  };

  const handleCollateralEdit = async () => {
    if (!address) return;
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    // Convert inputted amount into USD
    const amountUsd =
      collateralType === "SOL"
        ? parseFloat(collateral) * cachedPrices.solPrice
        : parseFloat(collateral) * cachedPrices.usdcPrice;

    try {
      const response = await fetch(
        `${BACKEND_URL}/trade/position/${position.positionId}/margin?publicKey=${address}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            marginDelta: isDeposit ? amountUsd : `-${amountUsd}`,
          }),
        }
      );

      if (response.ok) {
        helperToast.success("Collateral deposited successfully");
      } else {
        console.error("Failed to deposit collateral");
        helperToast.error("Failed to deposit collateral");
      }
    } catch (error) {
      console.error(error);
      helperToast.error("Failed to deposit collateral " + error);
    }

    onClose();
    resetInputs();
  };

  useEffect(() => {
    const fetchPrices = async () => {
      const { solPrice, usdcPrice } = await fetchCollateralPrices();
      setCollateralPrice(solPrice);
      setCachedPrices({ solPrice, usdcPrice });
    };

    fetchPrices();
  }, []);

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
        newLeverage = position.size / (position.margin + equivalents.value);
      } else {
        newLeverage = position.size / (position.margin - equivalents.value);
      }

      if (newLeverage < 1) {
        setIsValidLeverage(false);
        setLeverageErrorMessage("Min Leverage 1x");
      } else {
        setIsValidLeverage(true);
        setLeverageErrorMessage("");
      }
    };

    checkLeverageBoundaries();
  }, [equivalents.value, position.size, position.margin, isDeposit]);

  useEffect(() => {
    const calculateLiqPriceAfter = () => {
      const newLiqPrice = preCalculateLiquidationPrice(
        position.entryPrice, // Collateral Edit won't change entry price
        position.margin + equivalents.value, // Altered margin
        position.size, // Size stays the same
        position.isLong
      );

      setLiqPriceAfter(newLiqPrice);
    };

    calculateLiqPriceAfter();
  }, [
    equivalents.value,
    position.margin,
    position.entryPrice,
    position.size,
    position.isLong,
  ]);

  useEffect(() => {
    const fetchEquivalents = async () => {
      let collateralUsd = 0;

      if (cachedPrices.solPrice > 0 && cachedPrices.usdcPrice > 0) {
        collateralUsd = parseFloat(collateral) * collateralPrice;
      } else {
        const { solPrice, usdcPrice } = await fetchCollateralPrices();

        collateralUsd =
          collateralType === "USDC"
            ? parseFloat(collateral) * usdcPrice
            : parseFloat(collateral) * solPrice;

        setCachedPrices({
          solPrice,
          usdcPrice,
        });
      }

      setEquivalents({
        value: isNaN(collateralUsd) ? 0 : collateralUsd,
        tokens: isNaN(parseFloat(collateral)) ? 0 : parseFloat(collateral),
      });
    };

    fetchEquivalents();
  }, [collateral, collateralType, cachedPrices]);

  useEffect(() => {
    const fetchLeverages = async () => {
      const leverageBefore = (position.size / position.margin).toFixed(2);
      let leverageAfter;
      if (equivalents.value === 0) {
        leverageAfter = leverageBefore;
      } else {
        if (isDeposit) {
          leverageAfter = (
            position.size /
            (position.margin + equivalents.value)
          ).toFixed(2);
        } else {
          leverageAfter = (
            position.size /
            (position.margin - equivalents.value)
          ).toFixed(2);
        }
      }
      setLeverages({
        leverageBefore: parseFloat(leverageBefore),
        leverageAfter: parseFloat(leverageAfter),
      });
    };

    fetchLeverages();
  }, [collateral, equivalents.value, position.margin, position.size]);

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
              ? (collateralType === "SOL"
                  ? balances.solBalance
                  : balances.usdcBalance
                ).toFixed(position.isLong ? 4 : 2)
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
          <span>{collateralType}</span>
        </div>

        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Collateral Value</span>
          <p
            className={`${
              isDeposit ? "text-printer-green" : "text-printer-red"
            } text-nowrap flex items-center`}
          >
            <span className="text-gray-text">{`$${position.margin.toFixed(
              2
            )}`}</span>
            <PiArrowRightFill className="mx-1" />
            <span>{`$${(isDeposit
              ? position.margin + equivalents.value
              : position.margin - equivalents.value
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
            <span className="text-gray-text">{`$${estimateLiquidationPrice(
              position
            ).toFixed(priceDecimals)}`}</span>
            <PiArrowDownFill className="my-1" />
            <span>{`$${liqPriceAfter.toFixed(priceDecimals)}`}</span>
          </p>
        </div>

        <div className="flex flex-row justify-between text-sm text-gray-text">
          <span>Position Fee</span>
          <span>{positionFee}</span>
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
          onPress={handleCollateralEdit}
          disabled={
            (!isDeposit && !isValidWithdrawal) ||
            !isValidLeverage ||
            parseFloat(collateral) >
              (collateralType === "SOL"
                ? balances.solBalance
                : balances.usdcBalance)
          }
          className={`w-full flex items-center justify-center text-center text-base bg-p3-button hover:bg-p3-button-hover ${
            (!isDeposit && !isValidWithdrawal) ||
            !isValidLeverage ||
            parseFloat(collateral) >
              (collateralType === "SOL"
                ? balances.solBalance
                : balances.usdcBalance)
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
