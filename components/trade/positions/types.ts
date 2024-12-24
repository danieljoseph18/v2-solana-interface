export type TradeTableProps = {
  activeTab: string;
  currentMarketOnly: boolean;
  tradesData: TableData;
  handleOptionClick?: () => void;
  updateMarketStats: () => void;
  isLoading?: boolean;
};

interface TableData {
  openPositions: Position[];
  orders: Order[];
  closedPositions: Position[];
}
