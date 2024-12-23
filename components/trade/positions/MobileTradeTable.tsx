import React, { useEffect, useState } from "react";
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
  return position && typeof position.positionKey !== "undefined";
};

const isOrder = (position: any): position is Order => {
  return position && typeof position.triggerPrice !== "undefined";
};

const isClosedPosition = (position: any): position is ClosedPosition => {
  return position && typeof position.exitPrice !== "undefined";
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
  triggerGetTradeData,
  isLoading,
  currentMarketOnly,
  pendingPositions,
  updateMarketStats,
  setDecreasingPosition,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<
    Position | Order | ClosedPosition | null
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
  const [symbols, setSymbols] = useState<string[]>([]);

  const { asset } = useAsset();

  const filterPositions = (positions: any[]) => {
    let filteredPositions = positions;
    if (activeTab === "My Trades") {
      filteredPositions = [...positions, ...pendingPositions];
    }
    if (currentMarketOnly && asset) {
      return filteredPositions.filter(
        (position) => position.symbol === asset.symbol
      );
    }
    return filteredPositions;
  };

  useEffect(() => {
    const fetchIcons = async () => {
      const urls: { [symbol: string]: string } = {};
      for (const trade of tradesData.openPositions) {
        const symbol = trade.symbol.split(":")[0];
        const iconUrl = getImageUrlFromTokenSymbol(symbol);
        urls[symbol] = iconUrl;
      }
      setIconUrls(urls);
    };
    fetchIcons();
  }, [tradesData.openPositions]);

  useEffect(() => {
    const uniqueSymbols = [
      ...new Set([
        ...tradesData.openPositions.map((position) => position.symbol),
        ...tradesData.orders.map((order) => order.symbol),
        ...tradesData.closedPositions.map((position) => position.symbol),
      ]),
    ];
    setSymbols(uniqueSymbols);
  }, [tradesData]);

  const handlePositionClick = (
    trade: Position | Order | ClosedPosition,
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
          markPrice={prices[trade.symbol] || 0}
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
          markPrice={prices[trade.symbol] || 0}
          onClose={() => setIsModalOpen(false)}
          triggerGetTradeData={triggerGetTradeData}
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
          marketId={position.marketId}
          position={position}
          triggerRefetchPositions={triggerGetTradeData}
          markPrice={prices[position.symbol] || 0}
        />
      );
    } else if (option === "Withdraw Collateral") {
      setModalContent(
        <CollateralEdit
          isDeposit={false}
          onClose={() => setIsModalOpen(false)}
          marketId={position.marketId}
          position={position}
          triggerRefetchPositions={triggerGetTradeData}
          markPrice={prices[position.symbol] || 0}
        />
      );
    }
  };

  const handleCloseClick = (trade: Position) => {
    setModalContent(
      <DecreasePosition
        onClose={() => setIsModalOpen(false)}
        position={trade}
        markPrice={prices[trade.symbol] || 0}
        triggerRefetchPositions={triggerGetTradeData}
        updateMarketStats={updateMarketStats}
        setDecreasingPosition={setDecreasingPosition!}
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

  const renderTableData = (data: (Position | Order | ClosedPosition)[]) => {
    const filteredData = filterPositions(data);

    if (filteredData.length === 0) {
      return <EmptyState message={getEmptyMessage()} image={getEmptyImage()} />;
    }

    return filteredData.map((position, index) => {
      const markPrice = prices[position.symbol] || 0;
      const symbol = position.symbol.split(":")[0];
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
            <TokenLogo tokenSymbol={position.isLong ? "ETH" : "USDC"} />
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
                  ? `$${position.collateral.toFixed(2)}`
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
