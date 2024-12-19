import React from "react";
import Checkbox from "@/components/common/Checkbox";
import { FaRegQuestionCircle } from "react-icons/fa";
import InfoTooltip from "@/components/common/InfoTooltip";

const ChartOptions = ({
  shouldShow,
  chartPositions,
  setChartPositions,
  currentMarketOnly,
  setCurrentMarketOnly,
}: {
  shouldShow: boolean;
  chartPositions: boolean;
  setChartPositions: (chartPositions: boolean) => void;
  currentMarketOnly: boolean;
  setCurrentMarketOnly: (currentMarketOnly: boolean) => void;
}) => {
  return (
    <div
      className={`${
        shouldShow
          ? "grid grid-cols-2 md:grid-cols-3 items-center gap-x-4 gap-y-4"
          : "hidden"
      }`}
    >
      <label className="flex items-center gap-2 text-gray-text font-semibold text-sm md:px-2 order-1">
        <Checkbox
          isChecked={currentMarketOnly}
          setIsChecked={setCurrentMarketOnly}
        />
        <span className="text-nowrap">Current Market Only</span>
      </label>
      <label className="flex items-center gap-2 font-semibold text-sm order-3 md:order-2 text-gray-text">
        <Checkbox isChecked={chartPositions} setIsChecked={setChartPositions} />
        <span className="text-nowrap">Chart positions</span>
      </label>
      <div className="hidden sm:flex justify-end items-center gap-2 text-gray-text font-semibold text-sm order-2 md:order-3 text-right lg:text-left  ">
        <span className="text-nowrap">Charts by TradingView</span>
        <InfoTooltip
          text="Charts by TradingView"
          content={<FaRegQuestionCircle className="w-4 h-4 text-white" />}
        />
      </div>
    </div>
  );
};

export default ChartOptions;
