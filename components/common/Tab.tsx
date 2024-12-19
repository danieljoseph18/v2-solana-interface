import React from "react";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

type TabProps = {
  name: string;
  isActive: boolean;
  onClick: () => void;
  trend: string;
  position: "first" | "middle" | "last";
  rounded?: boolean;
  className?: string;
};

const Tab: React.FC<TabProps> = ({
  name,
  isActive,
  onClick,
  trend,
  position,
  rounded,
  className,
}) => {
  const roundedClass =
    position === "first"
      ? rounded
        ? "rounded-l-xl"
        : "rounded-l"
      : position === "last"
      ? rounded
        ? "rounded-r-xl"
        : "rounded-r"
      : "";

  const TrendIcon =
    trend === "up"
      ? FaArrowTrendUp
      : trend === "down"
      ? FaArrowTrendDown
      : null;

  return (
    <div
      className={`flex flex-row items-center justify-center gap-1 py-4 lg:py-3 px-1 md:px-[18px] text-sm md:text-base sm:min-w-[140px] w-full text-center text-nowrap font-bold cursor-pointer ${roundedClass} ${className} ${
        isActive
          ? "bg-green-grad border-2 border-cardborder text-white text-shadow-glow"
          : `text-base-gray ${
              rounded ? "bg-card-grad" : "bg-input-grad"
            } border-cardborder border-1`
      }`}
      onClick={onClick}
    >
      <span>{name}</span>
      {TrendIcon && (
        <TrendIcon
          className={`${isActive ? "text-white" : "text-base-gray"} text-lg`}
        />
      )}
    </div>
  );
};

export default Tab;
