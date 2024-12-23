import CustomTooltip from "@/components/common/CustomTooltip";
import React from "react";

type EntryStatsProps = {
  collateralIn: number;
  leverage: number;
  entryPrice: number | undefined;
  liqPrice: number;
  priceImpact: number;
  priceDecimals: number;
  availableLiquidity: number;
  positionFee: number;
};

const EntryStats: React.FC<EntryStatsProps> = ({
  collateralIn,
  leverage,
  entryPrice,
  liqPrice,
  priceImpact,
  priceDecimals,
  availableLiquidity,
  positionFee,
}) => {
  const stats = [
    {
      name: "Collateral In",
      value: collateralIn,
    },
    {
      name: "Leverage",
      value: leverage,
    },
    {
      name: "Entry Price",
      value: `$${entryPrice?.toFixed(priceDecimals)}`,
    },
    {
      name: "Liq Price",
      value: `$${liqPrice.toFixed(priceDecimals)}`,
    },
    {
      name: "Price Impact",
      value: `${priceImpact > 0 ? "+" : "-"}$${Math.abs(priceImpact).toFixed(
        2
      )}`,
    },
    {
      name: "Available Liquidity",
      value: `$${availableLiquidity.toFixed(2)}`,
    },
  ];
  return (
    <div className="flex flex-col w-full">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="flex flex-row justify-between text-sm text-gray-text"
        >
          <span>{stat.name}</span>
          <span>{stat.value ? stat.value : 0}</span>
        </div>
      ))}
      <div className="flex flex-row w-full items-center justify-between text-sm">
        <p className="text-gray-text">Fees</p>
        <CustomTooltip
          content={
            <div className="flex flex-col gap-2 p-4">
              <div className="flex flex-row w-full justify-between gap-6 text-printer-gray">
                <p>Position Fee</p>
                <p className="text-white font-bold">
                  ${positionFee.toFixed(2)}
                </p>
              </div>
            </div>
          }
          placement="top"
        >
          <div className="cursor-help text-sm">
            <p className="text-gray-text border-gray-text border-dashed border-b-1">
              ${positionFee.toFixed(2)}
            </p>
          </div>
        </CustomTooltip>
      </div>
    </div>
  );
};

export default EntryStats;
