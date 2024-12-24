import React from "react";
import OpenInterestBar from "./OpenInterestBar";
import { useAsset } from "../assets/AssetContext";
import { formatFloatWithCommas } from "@/lib/web3/formatters";
import InfoTooltip from "@/components/common/InfoTooltip";

const MarketStats = ({
  isLong,
  entryPrice,
  priceDecimals,
  marketStats,
  availableLiquidity,
}: {
  isLong: boolean;
  entryPrice: number;
  priceDecimals: number;
  marketStats: {
    borrowRateLong: number;
    borrowRateShort: number;
    fundingRate: number;
    fundingRateVelocity: number;
    openInterestLong: number;
    openInterestShort: number;
  };
  availableLiquidity: number;
}) => {
  const { asset } = useAsset();

  const formatRate = (rate: number) => {
    const percentage = rate * 100;
    return {
      display: `${percentage.toFixed(4)}%/d`,
      full: `${percentage.toFixed(20)}%/d`,
    };
  };

  const stats = [
    {
      title: "Market",
      value: `${asset ? asset.symbol : "BTC"} / USD`,
    },
    {
      title: "Entry Price",
      value: `$${entryPrice.toFixed(priceDecimals) ?? 0.0}`,
    },
    {
      title: "Borrow Fee",
      value: formatRate(
        isLong ? marketStats.borrowRateLong : marketStats.borrowRateShort
      ),
    },
    {
      title: "Funding Rate Velocity",
      value: formatRate(marketStats.fundingRateVelocity),
    },
    {
      title: "Funding Rate",
      value: formatRate(marketStats.fundingRate),
    },
    {
      title: "Available Liquidity",
      value: {
        display: `$${formatFloatWithCommas(availableLiquidity)}`,
        full: `$${availableLiquidity.toFixed(20)}`,
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3 bg-gradient-to-b w-full from-custom-top to-custom-bottom border-cardborder border-2 lg:border-l-0 lg:border-t-0">
      <div className="px-4 pt-4 w-full">
        <p className="text-sm text-base-gray">{`${isLong ? "Long" : "Short"} ${
          asset ? asset.symbol : "BTC"
        }`}</p>
      </div>
      <div className="bg-cardborder h-[2px] w-full"></div>
      <div className="flex flex-col text-gray-text text-sm w-full gap-1 px-4 pb-4">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-row justify-between items-center">
            <span>{stat.title}</span>
            {typeof stat.value === "string" ? (
              <span>{stat.value}</span>
            ) : (
              <InfoTooltip
                text={stat.value.full}
                content={
                  <p className="border-b border-dotted border-base-gray">
                    {stat.value.display}
                  </p>
                }
              />
            )}
          </div>
        ))}
        <div className="flex flex-row justify-between items-center">
          <span>Open Interest</span>
          <OpenInterestBar
            longs={marketStats.openInterestLong}
            shorts={marketStats.openInterestShort}
            currency={asset ? asset.symbol : "BTC"}
          />
        </div>
      </div>
    </div>
  );
};

export default MarketStats;
