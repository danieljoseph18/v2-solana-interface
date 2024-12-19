import React from "react";
import CustomTooltip from "@/components/common/CustomTooltip";

interface OpenInterestBarProps {
  longs: number;
  shorts: number;
  currency?: string;
}

const OpenInterestBar: React.FC<OpenInterestBarProps> = ({
  longs,
  shorts,
  currency = "BTC",
}) => {
  const total = longs + shorts;
  const longPercentage = total === 0 ? 50 : (longs / total) * 100;

  const tooltipContent = (
    <div className="p-2 text-sm">
      <p>
        Total {currency} longs: $
        {longs.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
      <p>
        Total {currency} shorts: $
        {shorts.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </div>
  );

  return (
    <CustomTooltip content={tooltipContent}>
      <div className="flex justify-center w-[105px] h-[9px] rounded-full relative bg-red-grad cursor-help">
        <div
          className="absolute inset-0 rounded-full bg-green-grad z-10"
          style={{ width: `${longPercentage}%` }}
        ></div>
      </div>
    </CustomTooltip>
  );
};

export default OpenInterestBar;
