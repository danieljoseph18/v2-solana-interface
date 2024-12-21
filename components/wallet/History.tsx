import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { Button } from "@nextui-org/react";
import LoadingAnimation from "@/app/assets/animations/LoadingAnimation";
import { getImageUrlFromTokenSymbol } from "@/lib/utils/getTokenImage";

const History = ({
  handleHistoryBackClick,
  prices,
}: {
  handleHistoryBackClick: () => void;
  prices: { [key: string]: number };
}) => {
  const [history, setHistory] = useState<
    {
      hash: `0x${string}`;
      from: `0x${string}`;
      to: `0x${string}`;
      value: bigint;
      token: string;
      timestamp: number;
    }[]
  >([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const formatTimeAgo = (timestamp: number): string => {
    const timestampMs = timestamp * 1000;
    const seconds = Math.floor((Date.now() - timestampMs) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };

  return (
    <div className="min-h-screen h-full bg-card-grad text-white p-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-row items-center justify-between pb-6">
          <FaArrowLeft
            className="h-6 w-6 cursor-pointer text-white hover:opacity-80"
            onClick={handleHistoryBackClick}
          />
          <p className="text-lg font-medium text-white">History</p>
          {/* Empty div to push the right side to the right */}
          <div></div>
        </div>
      </div>
      <div className="w-full h-px border-t border-tour-divider shadow-tour-divider-shadow"></div>
      <div className="flex flex-col w-full h-full gap-2">
        {historyLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingAnimation />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <Image
              src="/img/trade/no-chart-data.png"
              alt="No Historical Transfers"
              width={100}
              height={100}
            />
            <p className="text-xl font-medium mt-4 text-white text-center">
              No Historical Transfers
            </p>
            <p className="text-dashboard-gray text-sm text-center">
              Simply deposit / withdraw funds to or from your smart wallet to
              see <br /> your history update here.
            </p>

            <Button
              className="bg-green-grad hover:bg-green-grad-hover text-white py-4! px-4 rounded-[53px] border-printer-green border-1"
              onPress={handleHistoryBackClick}
            >
              Get Started
            </Button>
          </div>
        ) : (
          history.map((item) => (
            <div
              className="flex flex-row w-full items-center justify-between py-2"
              key={`${item.hash}-${item.timestamp}`}
            >
              <div className="flex flex-row gap-2 items-center">
                {item.from === "0x" ? (
                  <FiArrowUpRight className="text-printer-green text-4xl" />
                ) : (
                  <FiArrowDownLeft className="text-printer-red text-4xl" />
                )}
                <Image
                  src={getImageUrlFromTokenSymbol(item.token)}
                  alt={`${item.token} logo`}
                  width={28}
                  height={28}
                  className="rounded-full w-8 h-8"
                />
                <div className="flex flex-col">
                  <p className="text-sm text-white font-bold">
                    {`${item.token} ${
                      item.from === "0x" ? "Deposit" : "Withdraw"
                    }`}
                  </p>
                  <p className="text-gray-text text-sm font-medium">
                    {formatTimeAgo(item.timestamp)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="font-semibold text-sm">
                  {parseFloat(item.value.toString()).toFixed(6)} {item.token}
                </p>
                <p className="text-gray-text text-xs">
                  $
                  {(
                    parseFloat(item.value.toString()) * prices[item.token]
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
