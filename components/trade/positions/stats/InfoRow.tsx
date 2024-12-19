import React from "react";
import CustomTooltip from "@/components/common/CustomTooltip";

const InfoRow = ({
  label,
  value,
  valueColour,
  tooltip,
}: {
  label: string;
  value: string;
  valueColour?: string;
  tooltip?: string;
}) => (
  <div className="flex flex-row items-center justify-between text-sm text-gray-text">
    <span>{label}</span>
    {tooltip ? (
      <CustomTooltip content={tooltip} placement="top">
        <div className="cursor-help">
          <span
            className={
              valueColour
                ? `text-${valueColour} border-b-1 border-dashed border-gray-text`
                : "border-b-1 border-dashed border-gray-text"
            }
          >
            {value}
          </span>
        </div>
      </CustomTooltip>
    ) : (
      <span className={valueColour ? `text-${valueColour}` : ""}>{value}</span>
    )}
  </div>
);

export default InfoRow;
