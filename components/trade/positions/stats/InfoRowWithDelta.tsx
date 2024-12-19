import React from "react";
import { PiArrowRightFill } from "react-icons/pi";

const InfoRowWithDelta = ({
  label,
  valueBefore,
  valueAfter,
  valueColour,
  arrowColour,
}: {
  label: string;
  valueBefore: string;
  valueAfter: string;
  valueColour: string;
  arrowColour: string;
}) => (
  <div className="flex flex-row items-center justify-between text-sm text-gray-text">
    <span>{label}</span>
    <div className="flex flex-row items-center">
      <p className={`text-sm text-gray-text text-nowrap`}>{valueBefore}</p>
      <PiArrowRightFill className={`mx-1 ${arrowColour}`} />
      <p className={`${valueColour} text-sm text-gray-text text-nowrap`}>
        {valueAfter}
      </p>
    </div>
  </div>
);

export default InfoRowWithDelta;
