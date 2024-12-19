import React, { useEffect, useMemo, useRef, useState } from "react";
import AssetSelect from "./AssetSelect";
import VerticalDivider from "./VerticalDivider";
import AssetStat from "./AssetStat";
import { useAsset } from "./AssetContext";
import { getPriceDecimals } from "@/lib/web3/formatters";
import { formatFloatWithCommas } from "@/lib/web3/formatters";

const AssetBanner = ({
  markPrice,
  refreshVolume,
}: {
  markPrice: number;
  refreshVolume: number;
}) => {
  const [isAssetChanging, setIsAssetChanging] = useState(false);

  const [volume, setVolume] = useState<number>(0);

  const lastCalculatedDecimals = useRef(30);

  const { asset } = useAsset();

  useEffect(() => {
    setIsAssetChanging(true);
    const timer = setTimeout(() => setIsAssetChanging(false), 5000);
    return () => clearTimeout(timer);
  }, [asset]);

  const priceDecimals = useMemo(() => {
    const newDecimals = getPriceDecimals(markPrice);
    if (newDecimals !== lastCalculatedDecimals.current) {
      lastCalculatedDecimals.current = newDecimals;
      return newDecimals;
    }
    return lastCalculatedDecimals.current;
  }, [markPrice]);

  return (
    <div className="flex flex-col  lg:gap-0  ">
      <div className=" flex lg:hidden justify-center items-center shadow-2xl border-y-2 lg:border-2   border-cardborder lg:rounded-3  bg-card-grad text-white py-3.5 px-5">
        <AssetSelect />
      </div>

      <div className="flex flex-row justify-around items-center shadow-2xl   gap-2 border-b-2  lg:border-0 border-cardborder lg:border-b-2 bg-card-grad text-white xl:overflow-x-auto py-3.5 px-5">
        <div className="  hidden lg:flex trade-third-step">
          <AssetSelect />
        </div>
        <div className="hidden lg:flex">
          <VerticalDivider />
        </div>

        <>
          <AssetStat
            metric="Onchain Price"
            value={
              isAssetChanging
                ? "..."
                : `$${markPrice ? markPrice.toFixed(priceDecimals) : "..."}`
            }
            isPositive={asset ? asset.change! >= 0 : false}
            tracksDelta={true}
          />
          <VerticalDivider />
          <div className="flex flex-row w-full justify-around items-center overflow-x-auto">
            <AssetStat
              metric="24hr Change"
              value={`${asset ? asset.change!.toFixed(2) : "..."}%`}
              isPositive={asset ? asset.change! >= 0 : false}
              tracksDelta={true}
            />
            <VerticalDivider />
            <AssetStat
              metric="24hr Low"
              value={`$${
                asset
                  ? asset.low24h
                    ? asset.low24h.toFixed(priceDecimals)
                    : "..."
                  : "..."
              }`}
              isPositive={false}
              tracksDelta={false}
            />
            <VerticalDivider />
            <AssetStat
              metric="24hr High"
              value={`$${
                asset
                  ? asset.high24h
                    ? asset.high24h?.toFixed(priceDecimals)
                    : "..."
                  : "..."
              }`}
              isPositive={true}
              tracksDelta={false}
            />
            <VerticalDivider />
            <AssetStat
              metric="24hr Vol"
              value={`$${formatFloatWithCommas(volume)}`}
              isPositive={true}
              tracksDelta={false}
            />
          </div>
        </>
      </div>
    </div>
  );
};

export default AssetBanner;
