import React from "react";
import SvgIcon from "@/components/common/SvgIcon";
import { LongArrow, ShortArrow } from "@/config/svgs";
import useWindowSize from "@/hooks/useWindowSize";

interface TradeButtonsProps {
  isLong: boolean;
  setIsLong: (isLong: boolean) => void;
  openTradeModal?: (isLong: boolean) => void;
}

const TradeButtons: React.FC<TradeButtonsProps> = ({
  isLong,
  setIsLong,
  openTradeModal,
}) => {
  const { width } = useWindowSize();
  const isMobile = width !== undefined && width <= 768;

  const handleButtonClick = (direction: string) => {
    const newIsLong = direction === "long";
    if (isMobile && openTradeModal) {
      openTradeModal(newIsLong);
    } else {
      setIsLong(newIsLong);
    }
  };

  const getButtonClass = (direction: string) => {
    return isLong === (direction === "long")
      ? direction === "long"
        ? "lg:bg-green-grad text-white"
        : "lg:bg-red-grad text-white"
      : "text-printer-gray lg:!bg-none lg:!bg-transparent";
  };

  const svgColorClass = isLong ? "text-white" : "text-printer-gray";

  return (
    <div className="flex w-full gap-2 md:bg-input-grad border-cardborder md:border-2 rounded-lg max-w-full">
      <button
        className={`flex flex-row items-center justify-center gap-2 w-[50%] px-4 py-3 rounded font-bold text-base bg-green-grad text-white  ${getButtonClass(
          "long"
        )}`}
        onClick={() => handleButtonClick("long")}
      >
        Long
        <SvgIcon
          svgContent={LongArrow}
          className={`fill-current ${svgColorClass}`}
        />
      </button>
      <button
        className={`flex flex-row items-center justify-center gap-2 w-[50%] px-4 py-3 rounded font-bold text-base bg-red-grad text-white  ${getButtonClass(
          "short"
        )}`}
        onClick={() => handleButtonClick("short")}
      >
        Short
        <SvgIcon
          svgContent={ShortArrow}
          className={`fill-current ${svgColorClass}`}
        />
      </button>
    </div>
  );
};

export default TradeButtons;
