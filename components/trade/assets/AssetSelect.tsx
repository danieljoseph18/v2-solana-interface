import React, { useState, useEffect } from "react";
import AssetSelectPopup from "./AssetSelectPopup";
import { useAsset } from "./AssetContext";
import { BsChevronDown } from "react-icons/bs";
import { getImageForToken } from "@/lib/utils/getTokenImage";
import Image from "next/image";

const AssetSelect = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { asset, setAsset } = useAsset();

  const handleTogglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    if (!asset) {
      // Set default asset if none is selected
      setAsset({
        id: "1",
        symbol: "TOPKEK",
        tokenAddress: "AqHsVVzWuu7e1de1j7sGJ4MdJ74xUvCeXf19Y4dLiM3S",
        poolAddress: "F3N4RdnY3AtUSuqQcGo49EkgPd1Duuoo1XFEnKssMgwF",
        maxLeverage: 20,
        maintainanceMargin: 0.01,
        borrowingRate: 0.0001,
        fundingRate: 0.0001,
        fundingRateVelocity: 0.0001,
        lastUpdatedTimestamp: 1719859200,
        longOpenInterest: 1000000,
        shortOpenInterest: 1000000,
        availableLiquidity: 1000000,
        volume24h: 1000000,
        lastPrice: 1000000,
      });
    }
  }, [asset, setAsset]);

  return (
    <div className="w-full md:min-w-max">
      <div
        onClick={handleTogglePopup}
        className="flex flex-row gap-4 w-full lg:w-fit justify-between lg:justify-around items-center cursor-pointer transition-transform transform hover:opacity-85 opacity-100 hover:shadow-lg"
      >
        {asset ? (
          <div className="flex gap-4 items-center ">
            <Image
              src={getImageForToken(asset)}
              alt={`${asset.symbol} logo`}
              width={42}
              height={32}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-white font-bold text-base">
                {asset.symbol} / USD
              </p>
              <div className="flex flex-row gap-2">
                <p className="text-gray-500 text-sm underline decoration-current">
                  {asset.symbol}
                </p>
                <div className="flex items-center px-[2px] text-center text-dark-text font-bold border-cardborder border-2 text-xxs rounded bg-green-grad">
                  {asset.maxLeverage}x
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <div className="bg-loading rounded-full w-10 h-10 animate-pulse"></div>
            <div className="flex flex-col gap-2 w-20">
              <div className="w-full h-4 !rounded-3 bg-loading animate-pulse"></div>
              <div className="w-full h-4 !rounded-3 bg-loading animate-pulse"></div>
            </div>
          </div>
        )}
        <BsChevronDown
          className={`text-printer-orange text-2xl font-bold transition-transform duration-300 ${
            showPopup ? "rotate-180" : ""
          }`}
        />
      </div>
      <AssetSelectPopup isOpen={showPopup} onClose={handleTogglePopup} />
    </div>
  );
};

export default AssetSelect;
