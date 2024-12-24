import React, { useCallback, useEffect, useRef, useState } from "react";
import { TradeTableProps } from "./types";
import { useAsset } from "../assets/AssetContext";
import ModalV2 from "@/components/common/ModalV2";
import DecreasePosition from "./DecreasePosition";
import LoadingTradeTable from "./LoadingTradeTable";
import Image from "next/image";
import OpenPositionsTable from "./OpenPositionsTable";
import OrdersTable from "./OrdersTable";
import ClosedPositionsTable from "./ClosedPositionsTable";

// Empty state for if one of the trade table tabs have no data inside.
const EmptyState = ({ message, image }: { message: string; image: string }) => (
  <div className="flex flex-col items-center justify-center py-16 rounded">
    <Image
      src={image}
      alt="No Data"
      className="mb-4 w-24 h-auto"
      width={128}
      height={128}
    />
    <p className="text-gray-500 font-bold">{message}</p>
  </div>
);

const TradeTable: React.FC<TradeTableProps> = ({
  activeTab,
  tradesData,
  triggerGetTradeData,
  isLoading,
  currentMarketOnly,
  updateMarketStats,
}) => {
  const { asset, allAssets, setAsset } = useAsset();

  const [ids, setIds] = useState<string[]>([]);

  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const [modalSize, setModalSize] = useState<
    "xl" | "5xl" | "xs" | "sm" | "md" | "lg" | "2xl" | "3xl" | "4xl" | "full"
  >("xl");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const filterPositions = useCallback(
    (positions: any[]) => {
      if (currentMarketOnly && asset) {
        return positions.filter((position) => position.symbol === asset.symbol);
      }
      return positions;
    },
    [currentMarketOnly, asset]
  );

  const handleAssetSwitch = async (symbol: string) => {
    const asset = allAssets.find((asset) => asset.symbol === symbol);
    if (!asset) return;
    setAsset(asset);
  };

  const handleDecreaseClick = (position: any) => {
    handleAssetSwitch(position.symbol);

    setModalContent(
      <DecreasePosition
        onClose={() => setIsModalOpen(false)}
        position={position}
        markPrice={prices[position.marketId]}
        triggerRefetchPositions={triggerGetTradeData}
        updateMarketStats={updateMarketStats}
      />
    );

    setModalSize("5xl");

    setIsModalOpen(true);
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

  return (
    <div className="border-cardborder border-2 bg-card-grad h-64 border-r-0 overflow-y-auto custom-scrollbar">
      {isLoading ? (
        <LoadingTradeTable />
      ) : (
        <div className="overflow-y-auto custom-scrollbar">
          <div className={activeTab === "My Trades" ? "" : "hidden"}>
            {tradesData.openPositions.length === 0 ? (
              <EmptyState message={getEmptyMessage()} image={getEmptyImage()} />
            ) : (
              <OpenPositionsTable
                positions={filterPositions(tradesData.openPositions)}
                handleDecreaseClick={handleDecreaseClick}
                triggerGetTradeData={triggerGetTradeData}
                setModalContent={setModalContent}
                setIsModalOpen={setIsModalOpen}
                setModalSize={setModalSize}
                prices={prices}
              />
            )}
          </div>
          <div className={activeTab === "Orders" ? "" : "hidden"}>
            {tradesData.orders.length === 0 ? (
              <EmptyState message={getEmptyMessage()} image={getEmptyImage()} />
            ) : (
              <OrdersTable
                orders={filterPositions(tradesData.orders)}
                prices={prices}
              />
            )}
          </div>
          <div className={activeTab === "History" ? "" : "hidden"}>
            {tradesData.closedPositions.length === 0 ? (
              <EmptyState message={getEmptyMessage()} image={getEmptyImage()} />
            ) : (
              <ClosedPositionsTable
                closedPositions={filterPositions(tradesData.closedPositions)}
              />
            )}
          </div>
        </div>
      )}
      <ModalV2
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        size={modalSize}
      >
        {modalContent}
      </ModalV2>
    </div>
  );
};

export default TradeTable;
