import React from "react";
import { IoIosTrendingDown } from "react-icons/io";
import { IoIosTrendingUp } from "react-icons/io";
import { nFormatter } from "@/lib/web3/formatters";

type Props = {
  value: number;
  symbol?: string;
  className?: string;
  hideText?: boolean;
};

const PercentageDirection = ({ value, symbol, className, hideText }: Props) => {
  return (
    <div
      className={`flex gap-2 items-center ${
        value > 0
          ? "text-printer-green"
          : value < 0
          ? "text-printer-red"
          : "text-printer-gray"
      } ${className ? className : "text-sm font-semibold"}`}
    >
      {value > 0 ? (
        <IoIosTrendingUp />
      ) : value < 0 ? (
        <IoIosTrendingDown />
      ) : null}
      <p className={`${hideText ? "hidden" : ""}`}>
        {value > 0 ? "+" : ""}
        {nFormatter(Math.abs(value), 2)}
        {symbol || "%"}
      </p>
    </div>
  );
};

export default PercentageDirection;
