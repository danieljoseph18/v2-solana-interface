export type TradeTableProps = {
  activeTab: string;
  currentMarketOnly: boolean;
  tradesData: TableData;
  triggerGetTradeData: () => void;
  handleOptionClick?: () => void;
  updateMarketStats: () => void;
  isLoading?: boolean;
  pendingPositions: Position[];
  decreasingPosition: Position | null;
  setDecreasingPosition?: (position: Position | null) => void;
};

interface TableData {
  openPositions: Position[];
  orders: Order[];
  closedPositions: ClosedPosition[];
}
