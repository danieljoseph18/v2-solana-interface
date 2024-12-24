import React, { useCallback, useEffect, useRef, useState } from "react";
import { TradeTableProps } from "./types";
import TradeDetailsModal from "./TradeDetailsModal";
import { MdKeyboardArrowRight } from "react-icons/md";
import Image from "next/image";
import { getClosedPositionProfitLoss, getProfitLoss } from "./helpers";
import TokenLogo from "@/components/common/TokenLogo";
import { getImageUrlFromTokenSymbol } from "@/lib/utils/getTokenImage";
import { useAsset } from "../assets/AssetContext";
import DecreasePosition from "./DecreasePosition";
import ModalV2 from "@/components/common/ModalV2";
import CollateralEdit from "./CollateralEdit";
import { getPriceDecimals } from "@/lib/web3/formatters";
import OrderDetailsModal from "./OrderDetailsModal";

const isPosition = (position: any): position is Position => {
  return (
    position &&
    typeof position.status !== "undefined" &&
    position.status === "OPEN"
  );
};

const isOrder = (position: any): position is Order => {
  return position && typeof position.triggerPrice !== "undefined";
};

const isClosedPosition = (position: any): position is Position => {
  return (
    position &&
    typeof position.status !== "undefined" &&
    (position.status === "CLOSED" || position.status === "LIQUIDATED")
  );
};

const EmptyState = ({ message, image }: { message: string; image: string }) => (
  <div className="flex flex-col items-center justify-center py-16 rounded">
    <Image
      src={image}
      alt={message}
      className="mb-4 w-24 h-auto"
      width={128}
      height={128}
    />
    <p className="text-printer-gray font-bold">{message}</p>
  </div>
);

const MobileTradeTable: React.FC<TradeTableProps> = ({
  activeTab,
  tradesData,
  isLoading,
  currentMarketOnly,
  updateMarketStats,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<
    Position | Order | null
  >(null);

  const [positionProfitLoss, setPositionProfitLoss] = useState<{
    pnlUsd: string;
    pnlPercentage: string;
    hasProfit: boolean;
  }>({
    pnlUsd: "$0.00",
    pnlPercentage: "0.00%",
    hasProfit: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean[]>([]);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [iconUrls, setIconUrls] = useState<{ [symbol: string]: string }>({});
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [ids, setIds] = useState<string[]>([]);

  const { asset } = useAsset();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const filterPositions = (positions: any[]) => {
    let filteredPositions = positions;

    if (currentMarketOnly && asset) {
      return filteredPositions.filter(
        (position) => position.symbol === asset.symbol
      );
    }
    return filteredPositions;
  };

  const updatePricesForAssets = useCallback(async (ids: string[]) => {
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    try {
      const pricePromises = ids.map(async (id) => {
        const response = await fetch(`${BACKEND_URL}/price/market/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch price for ${id}`);
        }
        const priceStr: string = await response.json();
        const price = parseFloat(priceStr);
        return {
          customId: id,
          price,
        };
      });

      const priceResponses = await Promise.all(pricePromises);

      const updatedPrices: { [key: string]: number } = {};
      priceResponses.forEach((item) => {
        updatedPrices[item.customId] = item.price;
      });

      setPrices((prevPrices) => ({
        ...prevPrices,
        ...updatedPrices,
      }));
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  }, []);

  useEffect(() => {
    const allPositions = [
      ...tradesData.openPositions,
      ...tradesData.orders,
      ...tradesData.closedPositions,
    ];
    const uniqueIds = [
      ...new Set(allPositions.map((position) => position.marketId)),
    ];
    setIds(uniqueIds);
  }, [tradesData]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (ids.length > 0) {
      updatePricesForAssets(ids);
      intervalRef.current = setInterval(() => {
        updatePricesForAssets(ids);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [ids, updatePricesForAssets]);

  const handlePositionClick = (
    trade: Position | Order,
    profitLoss: {
      pnlUsd: string;
      pnlPercentage: string;
      hasProfit: boolean;
    },
    index?: number
  ) => {
    setSelectedPosition(trade);

    setPositionProfitLoss(profitLoss);

    if (isPosition(trade)) {
      setModalContent(
        <TradeDetailsModal
          position={trade}
          profitLoss={profitLoss}
          markPrice={prices[trade.marketId] || 0}
          handleCloseClick={() => handleCloseClick(trade)}
          handleOptionClick={(option) =>
            handleOptionClick(index!, trade, option)
          }
          onClose={() => setIsModalOpen(false)}
        />
      );
      setIsModalOpen(true);
    } else if (isOrder(trade)) {
      setModalContent(
        <OrderDetailsModal
          order={trade}
          markPrice={prices[trade.marketId] || 0}
          onClose={() => setIsModalOpen(false)}
        />
      );
      setIsModalOpen(true);
    }
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
  };

  const handleCloseClick = (trade: Position) => {
    setModalContent(
      <DecreasePosition
        onClose={() => setIsModalOpen(false)}
        position={trade}
        markPrice={prices[trade.marketId] || 0}
        updateMarketStats={updateMarketStats}
      />
    );
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case "My Trades":
        return "PLACE A TRADE TO SEE IT HERE";
      case "Orders":
        return "SET A TRADE ORDER TO SEE IT HERE";
      case "History":
        return "CLOSE A TRADE TO SEE IT HERE";
      default:
        return "";
    }
  };

  const getEmptyImage = () => {
    switch (activeTab) {
      case "My Trades":
      case "History":
        return "/img/trade/empty_trades.svg";
      case "Orders":
        return "/img/trade/empty_orders.svg";
      default:
        return "";
    }
  };

  const renderTableData = (data: (Position | Order)[]) => {
    const filteredData = filterPositions(data);

    if (filteredData.length === 0) {
      return <EmptyState message={getEmptyMessage()} image={getEmptyImage()} />;
    }

    return filteredData.map((position, index) => {
      const markPrice = prices[position.marketId] || 0;
      const symbol = position.symbol;
      const profitLoss = isClosedPosition(position)
        ? getClosedPositionProfitLoss(position)
        : isOrder(position)
        ? getProfitLoss(position.triggerPrice, position)
        : getProfitLoss(markPrice, position);
      const priceDecimals = getPriceDecimals(markPrice);
      const isPending = "isPending" in position && position.isPending;

      return (
        <div
          key={index}
          className={`flex flex-col gap-4 p-4 w-full cursor-pointer ${
            isPending ? "opacity-50" : ""
          }`}
          onClick={() =>
            !isPending && handlePositionClick(position, profitLoss, index)
          }
        >
          <div className="flex justify-between">
            <div className="flex flex-row gap-2">
              <span className="font-bold">{`${symbol}/USD`}</span>
              <span
                className={
                  position.isLong ? "text-printer-green" : "text-printer-red"
                }
              >
                {position.isLong ? "LONG" : "SHORT"}
              </span>
              <span
                className={
                  position.orderType === "Stop Loss"
                    ? "text-printer-red"
                    : position.orderType === "Take Profit"
                    ? "text-printer-green"
                    : ""
                }
              >
                {position.orderType}
              </span>
            </div>
            {!isClosedPosition(position) && (
              <MdKeyboardArrowRight className="text-lg" />
            )}
          </div>
          <div className="flex justify-between text-sm text-printer-gray">
            <span>Size: </span>
            <span>{position.size.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between text-sm text-printer-gray">
            <span>Collateral Asset: </span>
            <TokenLogo tokenSymbol={position.marginToken} />
          </div>
          <div className="flex justify-between text-sm text-printer-gray">
            <div className="flex flex-col">
              <span className="text-sm">Collateral</span>
              <span className="text-xs">
                {activeTab === "Orders" ? "Estimated PnL" : "PnL"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-end">
                {isPosition(position)
                  ? `$${position.margin.toFixed(2)}`
                  : "N/A"}
              </span>
              <span
                className={`text-xs ${
                  profitLoss.hasProfit
                    ? "text-printer-green"
                    : "text-printer-red"
                }`}
              >{`${profitLoss.pnlUsd} (${profitLoss.pnlPercentage})`}</span>
            </div>
          </div>
          {activeTab === "My Trades" && (
            <div className="flex justify-between text-sm text-printer-gray">
              <span>Mark Price: </span>
              <span>${markPrice.toFixed(priceDecimals)}</span>
            </div>
          )}
          {activeTab === "History" && (
            <div className="flex justify-between text-sm text-printer-gray">
              <span>Status: </span>
              <span
                className={
                  position.exitStatus === "Closed"
                    ? "text-printer-green"
                    : "text-printer-red"
                }
              >
                {position.exitStatus}
              </span>
            </div>
          )}
        </div>
      );
    });
  };

  const LoadingState = () => (
    <div className="animate-pulse flex flex-col gap-4">
      {[1, 2, 3].map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="h-6 bg-table-gray rounded w-3/4"></div>
          <div className="h-4 bg-table-gray rounded w-1/2"></div>
          <div className="h-4 bg-table-gray rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 bg-card-grad border-cardborder border-y-2 w-full p-4 max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
      {isLoading ? (
        <LoadingState />
      ) : (
        <>
          <div className={activeTab === "My Trades" ? "" : "hidden"}>
            {renderTableData(tradesData.openPositions)}
          </div>
          <div className={activeTab === "Orders" ? "" : "hidden"}>
            {renderTableData(tradesData.orders)}
          </div>
          <div className={activeTab === "History" ? "" : "hidden"}>
            {renderTableData(tradesData.closedPositions)}
          </div>
        </>
      )}
      <ModalV2
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        size={"full"}
      >
        {modalContent}
      </ModalV2>
    </div>
  );
};

export default MobileTradeTable;
