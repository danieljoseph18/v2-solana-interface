import React from "react";

interface TradeImageOverlayProps {
  position: string;
  pnlPercentage: number;
  entryPrice: number;
  currentPrice: number;
  assetLogo: string;
  isLong: boolean;
  leverage: number;
}

const TradeImageOverlay: React.FC<TradeImageOverlayProps> = ({
  position,
  pnlPercentage,
  entryPrice,
  currentPrice,
  assetLogo,
  isLong,
  leverage,
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex flex-row items-center justify-between">
      <div className="flex gap-1">
        <img src={assetLogo} alt={position} width={20} height={20} />
        <p className="text-white font-bold">{position}</p>
      </div>
      <p className={isLong ? "text-printer-green" : "text-printer-red"}>{`${
        isLong ? "Long" : "Short"
      } ${leverage}x`}</p>
    </div>
    <p
      className={
        pnlPercentage > 0
          ? "text-printer-green font-bold"
          : "text-printer-red font-bold"
      }
    >{`${pnlPercentage}%`}</p>
    <div className="flex flex-row items-center justify-between">
      <p className="text-printer-gray">Entry Price</p>
      <p>{`$${entryPrice}`}</p>
    </div>
    <div className="flex flex-row items-center justify-between">
      <p className="text-printer-gray">Current Price</p>
      <p>{`$${currentPrice}`}</p>
    </div>
  </div>
);

export default TradeImageOverlay;
