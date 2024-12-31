"use client";

import React, { useState, useRef } from "react";
import CountUp from "react-countup";
import { nFormatter } from "@/lib/web3/formatters";
import PercentageDirection from "@/components/home/PercentageDirection";

const ProtocolStats = () => {
  const [statsData, setStatsData] = useState<{
    totalVolume: number;
    dailyVolume: number;
    dailyFees: number;
    allTimeLpFees: number;
    dailyVolumeChange: number;
  }>({
    totalVolume: 0,
    dailyVolume: 0,
    dailyFees: 0,
    allTimeLpFees: 0,
    dailyVolumeChange: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const StatCard = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: React.ReactNode;
    icon?: React.ReactNode;
  }) => (
    <div className="relative w-full h-full max-w-[250px]">
      <div
        className="absolute inset-0 rounded-lg bg-gradient-to-b from-[#7a7aa6] via-[#7a7aa6] to-[#2f2f40]"
        style={{ opacity: 1, zIndex: -1 }}
      ></div>
      <div className="relative h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#15153de3] to-[#070708] rounded-lg p-4 border border-[#7a7aa6] flex flex-col justify-between">
        <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
        <div className="flex items-center">
          <span className="text-white text-2xl font-bold mr-2">{value}</span>
          {icon}
        </div>
      </div>
    </div>
  );

  const statCards = [
    {
      title: "All time Volume",
      value: (data: number) => (
        <CountUp
          end={data}
          prefix="$"
          enableScrollSpy
          formattingFn={(value) => nFormatter(value, 2, "", true)}
        />
      ),
      dataKey: "totalVolume",
    },
    {
      title: "Daily LP Rewards",
      value: (data: number) => (
        <CountUp
          end={data}
          enableScrollSpy
          formattingFn={(value) => nFormatter(value, 0, "", true)}
        />
      ),
      dataKey: "dailyFees",
    },
    {
      title: "All time LP Rewards",
      value: (data: number) => (
        <CountUp
          end={data}
          prefix="$"
          enableScrollSpy
          formattingFn={(value) => nFormatter(value, 0, "", true)}
        />
      ),
      dataKey: "allTimeLpFees",
    },
    {
      title: "24h Volume",
      value: () => (
        <div className="flex items-center gap-1">
          <PercentageDirection
            hideText
            value={statsData ? statsData.dailyVolumeChange : 0}
            symbol=""
            className="!text-xl !font-bold"
          />
          <p
            className={`${
              statsData && statsData.dailyVolumeChange > 0
                ? "text-printer-green"
                : statsData && statsData.dailyVolumeChange < 0
                ? "text-printer-red"
                : "text-printer-gray"
            } font-bold text-xl`}
          >
            {statsData ? (
              <CountUp
                end={statsData.dailyVolume}
                enableScrollSpy
                formattingFn={(value) => nFormatter(value, 0, "", true)}
              />
            ) : (
              // nFormatter(statsData.dailyVolume, 2, "$", true)
              "..."
            )}
          </p>
        </div>
      ),
      dataKey: "dailyVolume",
    },
  ];

  return (
    <div className="w-full pb-6" ref={containerRef}>
      <h2 className="text-white text-3xl font-bold text-center mb-8">
        Protocol Stats
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value(
              statsData[card.dataKey as keyof typeof statsData]
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default ProtocolStats;
