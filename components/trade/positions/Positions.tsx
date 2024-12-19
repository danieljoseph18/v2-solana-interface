import React from "react";
import TradeTable from "./TradeTable";
import useWindowSize from "@/hooks/useWindowSize";
import MobileTradeTable from "./MobileTradeTable";

const MOBILE_SCREEN_SIZE = 768;

interface TableData {
  openPositions: Position[];
  orders: Order[];
  closedPositions: ClosedPosition[];
}

const Positions = ({
  activeTab,
  openPositions,
  orders,
  closedPositions,
  triggerGetTradeData,
  isTableLoading,
  currentMarketOnly,
  pendingPositions,
  updateMarketStats,
  decreasingPosition,
  setDecreasingPosition,
}: {
  activeTab: string;
  openPositions: Position[];
  orders: Order[];
  closedPositions: ClosedPosition[];
  triggerGetTradeData: () => void;
  isTableLoading: boolean;
  currentMarketOnly: boolean;
  pendingPositions: Position[];
  updateMarketStats: () => void;
  decreasingPosition: Position | null;
  setDecreasingPosition: (position: Position | null) => void;
}) => {
  const { width } = useWindowSize();
  const isMobile = width && width < MOBILE_SCREEN_SIZE;

  const tradesData: TableData = {
    openPositions,
    orders,
    closedPositions,
  };

  return (
    <div className="flex flex-col w-full">
      {isMobile ? (
        <MobileTradeTable
          activeTab={activeTab}
          tradesData={tradesData}
          triggerGetTradeData={triggerGetTradeData}
          isLoading={isTableLoading}
          currentMarketOnly={currentMarketOnly}
          pendingPositions={pendingPositions}
          updateMarketStats={updateMarketStats}
          decreasingPosition={decreasingPosition}
          setDecreasingPosition={setDecreasingPosition}
        />
      ) : (
        <TradeTable
          activeTab={activeTab}
          tradesData={tradesData}
          triggerGetTradeData={triggerGetTradeData}
          isLoading={isTableLoading}
          currentMarketOnly={currentMarketOnly}
          pendingPositions={pendingPositions}
          updateMarketStats={updateMarketStats}
          decreasingPosition={decreasingPosition}
          setDecreasingPosition={setDecreasingPosition}
        />
      )}
    </div>
  );
};

export default Positions;
