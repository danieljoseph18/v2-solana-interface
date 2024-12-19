import React from "react";
import Image from "next/image";

type AssetStatParams = {
  metric: string;
  value: string;
  isPositive: boolean;
  tracksDelta: boolean;
};

const AssetStat: React.FC<AssetStatParams> = ({
  metric,
  value,
  isPositive,
  tracksDelta,
}) => {
  return (
    <div className="flex flex-col">
      <p className="text-gray-text text-sm text-nowrap">{metric}</p>
      <div className="flex flex-row gap-3">
        {tracksDelta && (
          <Image
            src={`/img/trade/${isPositive ? "increase" : "decrease"}-stat.png`}
            width={15}
            height={19.81}
            alt="Directional Arrow"
          />
        )}
        <p
          className={`font-bold text-base text-nowrap ${
            isPositive ? "text-printer-green" : "text-printer-red"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default AssetStat;
