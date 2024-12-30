import React, { useMemo, useState } from "react";
import { getProfitLoss } from "./helpers";
import { getPriceDecimals } from "@/lib/web3/formatters";
import { Button } from "@nextui-org/react";
import { useAsset } from "../assets/AssetContext";
import CollateralEdit from "./CollateralEdit";
import CustomSelect from "../interaction/CustomSelect";
import InfoTooltip from "@/components/common/InfoTooltip";
import { IoIosWarning } from "react-icons/io";
import TradeShare from "./TradeShare";
import { FaShareSquare } from "react-icons/fa";
import { getImageUrlFromTokenSymbol } from "@/lib/utils/getTokenImage";
import { estimateLiquidationPrice } from "@/lib/web3/position/estimateLiquidationPrice";
import { formatDateTime } from "@/lib/utils/dates";

interface OpenPositionsTableProps {
  positions: Position[];
  handleDecreaseClick: (position: Position) => void;
  setModalContent: (content: React.ReactNode) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  setModalSize: (
    size:
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "full"
  ) => void;
  prices: { [key: string]: number };
}

const calculateUnwindingThreshold = (leverage: number): number => {
  const MAX_LEVERAGE = 1000;
  const BASE_MAINTENANCE_MARGIN = 0.01; // 1%
  const MAINTENANCE_MARGIN_SCALE = 0.19; // 19% scale (max 20% maintenance margin)

  let bonusMaintenanceMargin: number;
  if (leverage >= MAX_LEVERAGE) {
    bonusMaintenanceMargin = MAINTENANCE_MARGIN_SCALE;
  } else {
    bonusMaintenanceMargin =
      (MAINTENANCE_MARGIN_SCALE * leverage) / MAX_LEVERAGE;
  }

  const maintenanceMargin = BASE_MAINTENANCE_MARGIN + bonusMaintenanceMargin;
  return maintenanceMargin * 100; // Convert to percentage
};

const OpenPositionsTable: React.FC<OpenPositionsTableProps> = ({
  positions,
  handleDecreaseClick,
  setModalContent,
  setIsModalOpen,
  setModalSize,
  prices,
}) => {
  const { allAssets, setAsset } = useAsset();

  const [isOpen, setIsOpen] = useState<boolean[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );

  const handleAssetSwitch = async (symbol: string) => {
    const asset = allAssets.find((asset) => asset.symbol === symbol);
    if (!asset) return;
    setAsset(asset);
  };

  const handleOptionClick = (
    index: number,
    position: Position,
    option: "Deposit Collateral" | "Withdraw Collateral"
  ) => {
    const updatedOpenState = [...isOpen];
    updatedOpenState[index] = false;
    setIsOpen(updatedOpenState);

    if (option === "Deposit Collateral") {
      setModalContent(
        <CollateralEdit
          isDeposit={true}
          onClose={() => setIsModalOpen(false)}
          position={position}
          markPrice={prices[position.marketId] || 0}
        />
      );
    } else if (option === "Withdraw Collateral") {
      setModalContent(
        <CollateralEdit
          isDeposit={false}
          onClose={() => setIsModalOpen(false)}
          position={position}
          markPrice={prices[position.marketId] || 0}
        />
      );
    }
    setModalSize("lg");
    setIsModalOpen(true);
  };

  const handleShareClick = (position: Position) => {
    setSelectedPosition(position);

    const markPrice = prices[position.marketId] || 0;

    const profitLoss = getProfitLoss(markPrice, position);

    const leverage = parseFloat((position.size / position.margin).toFixed(2));

    setModalContent(
      <TradeShare
        position={position.marketId}
        pnlPercentage={parseFloat(profitLoss.pnlPercentage)}
        entryPrice={position.entryPrice}
        currentPrice={markPrice}
        assetLogo={getImageUrlFromTokenSymbol(position.symbol)}
        isLong={position.isLong}
        leverage={leverage}
        onClose={() => setIsModalOpen(false)}
        isClosed={false}
      />
    );
    setModalSize("lg");
    setIsModalOpen(true);
  };

  // size / collateral
  const getLeverage = (position: any) => {
    return (position.size / position.margin).toFixed(2);
  };

  // Memoize computed positions to avoid unnecessary recalculations
  const allPositions = useMemo(() => {
    return positions.map((position) => {
      const markPrice = prices[position.marketId] || 0;
      const profitLoss = getProfitLoss(markPrice, position);
      const liqPrice = estimateLiquidationPrice(position) || 0;
      const priceDecimals = getPriceDecimals(markPrice);
      const leverage = parseFloat(getLeverage(position));
      const unwindingThreshold = calculateUnwindingThreshold(leverage);

      return {
        ...position,
        markPrice,
        profitLoss,
        liqPrice,
        priceDecimals,
        leverage,
        unwindingThreshold,
      };
    });
  }, [positions, prices]);

  return (
    <table className="min-w-full divide-y divide-cardborder">
      <thead>
        <tr className=" bg-dark-1">
          <th className="px-7 py-4 text-left text-xs font-medium text-base-gray tracking-wider">
            <div className="flex flex-col">
              <span>Position /</span>
              <span>Side</span>
            </div>
          </th>
          <th className="px-7 py-4  text-left text-xs font-medium text-base-gray tracking-wider">
            <div className="flex flex-col">
              <span>Size /</span>
              <span>Leverage</span>
            </div>
          </th>
          <th className="px-7 py-4  text-left text-xs font-medium text-base-gray tracking-wider">
            <div className="flex flex-col">
              <span>Entry Price /</span>
              <span>Time</span>
            </div>
          </th>
          <th className="px-7 py-4  text-left text-xs font-medium text-base-gray tracking-wider">
            <div className="flex flex-col">
              <span>Mark Price /</span>
              <span>Liq Price</span>
            </div>
          </th>
          <th className="px-7 py-4  text-left text-xs font-medium text-base-gray tracking-wider">
            <div className="flex flex-col">
              <span>Profit /</span>
              <span>Loss</span>
            </div>
          </th>
          <th className="px-7 py-4 text-left text-xs font-medium text-base-gray tracking-wider">
            Manage Position
          </th>
        </tr>
      </thead>
      <tbody className="border-b border-cardborder bg-card-grad text-white text-sm">
        {allPositions.map((position, index) => {
          const currentPnlPercentage = parseFloat(
            position.profitLoss?.pnlPercentage || "0"
          );
          const unwindingPnlPercentage = -(
            100 - (position.unwindingThreshold || 0)
          );

          return (
            <tr
              key={position.positionId || index}
              onClick={() => handleAssetSwitch(position.symbol)}
              className={`border-y-cardborder border-y-1 bg-card-grad cursor-pointer`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span>{`${position.symbol}/USD`}</span>
                  <span
                    className={`
                      ${
                        position.isLong
                          ? "text-printer-green"
                          : "text-printer-red"
                      }
                    `}
                  >
                    {position.isLong ? "LONG" : "SHORT"}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span>{`${position.size.toFixed(2)} USD`}</span>
                  <span className="text-printer-green">
                    {`${position.leverage.toFixed(2)}x`}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span>{`$${
                    position.entryPrice == 0
                      ? "..."
                      : position.entryPrice.toFixed(position.priceDecimals)
                  }`}</span>
                  <span className="text-base-gray">
                    {formatDateTime(position.createdAt)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span>{`$${position.markPrice.toFixed(
                    position.priceDecimals
                  )}`}</span>

                  {position.liqPrice == 0 ? (
                    <p className="text-base-gray">...</p>
                  ) : (
                    <span className="text-base-gray">
                      {`$${position.liqPrice.toFixed(position.priceDecimals)}`}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div
                  className={`flex flex-col ${
                    position.profitLoss?.hasProfit
                      ? "text-printer-green"
                      : "text-printer-red"
                  }`}
                >
                  <div className="flex flex-row items-center gap-1">
                    <span>
                      {position.markPrice ? position.profitLoss?.pnlUsd : "..."}
                    </span>
                    {position.markPrice &&
                      (() => {
                        const showTooltipThreshold =
                          unwindingPnlPercentage + 20;

                        return currentPnlPercentage <= showTooltipThreshold ? (
                          <InfoTooltip
                            text={`Your position will begin unwinding at ${unwindingPnlPercentage.toFixed(
                              2
                            )}%. To increase the liquidation threshold, try lowering the leverage.`}
                            content={
                              <IoIosWarning className="w-4 h-4 text-printer-red" />
                            }
                          />
                        ) : null;
                      })()}
                  </div>
                  <span>
                    {position.markPrice
                      ? position.profitLoss?.pnlPercentage
                      : "..."}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-row justify-center gap-2">
                    <FaShareSquare
                      className="text-printer-orange text-xl hover:text-printer-dark-orange cursor-pointer mr-2"
                      onClick={() => handleShareClick(position)}
                    />
                    <CustomSelect
                      options={["Deposit Collateral", "Withdraw Collateral"]}
                      selectedOption=""
                      onOptionSelect={(option: string) => {
                        if (
                          option === "Deposit Collateral" ||
                          option === "Withdraw Collateral"
                        ) {
                          handleOptionClick(index, position, option);
                        }
                      }}
                      showImages={false}
                      showText={true}
                      defaultDisplay={
                        <p className="text-printer-orange hover:printer-dark-orace">
                          Edit
                        </p>
                      }
                      hideDropdownArrow={true}
                      positionAbove={true}
                    />
                  </div>
                  <Button
                    className="ml-2 text-white px-2 cursor-pointer bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 font-bold"
                    onPress={() => {
                      handleDecreaseClick(position);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default OpenPositionsTable;
