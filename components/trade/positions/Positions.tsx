import React from "react";
import TradeTable from "./TradeTable";
import useWindowSize from "@/hooks/useWindowSize";
import MobileTradeTable from "./MobileTradeTable";

const MOBILE_SCREEN_SIZE = 768;

interface TableData {
  openPositions: Position[];
  orders: Order[];
  closedPositions: Position[];
}

const Positions = ({
  activeTab,
  openPositions,
  orders,
  closedPositions,
  isTableLoading,
  currentMarketOnly,
  updateMarketStats,
}: {
  activeTab: string;
  openPositions: Position[];
  orders: Order[];
  closedPositions: Position[];
  isTableLoading: boolean;
  currentMarketOnly: boolean;
  updateMarketStats: () => void;
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
          isLoading={isTableLoading}
          currentMarketOnly={currentMarketOnly}
          updateMarketStats={updateMarketStats}
        />
      ) : (
        <TradeTable
          activeTab={activeTab}
          tradesData={tradesData}
          isLoading={isTableLoading}
          currentMarketOnly={currentMarketOnly}
          updateMarketStats={updateMarketStats}
        />
      )}
    </div>
  );
};

export default Positions;
