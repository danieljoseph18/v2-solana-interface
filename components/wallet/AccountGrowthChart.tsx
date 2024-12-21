"use client";

import React, { useState, useEffect } from "react";
// import ReactECharts from "echarts-for-react";
// import { fetchTokensData } from "@/app/web3/wallets/getGrowthChartData";

type DataPoint = {
  timestamp: number;
  value: number;
};

const AccountGrowthChart = ({
  smartAccountAddress,
  chainId,
}: {
  smartAccountAddress: `0x${string}`;
  chainId: number;
}) => {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!smartAccountAddress || !chainId) {
        return;
      }

      try {
        // Reset the data before fetching new data
        setData([]);

        // const chartData = await fetchTokensData(
        //   smartAccountAddress,
        //   30, // 30 days
        //   chainId
        // );

        // setData(chartData);
      } catch (error) {
        console.error("Error fetching growth chart data:", error);
      }
    };

    fetchData();
  }, [smartAccountAddress, chainId]);

  const getOption = () => {
    return {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        formatter: function (params: any) {
          const date = new Date(params[0].value[0]);
          const value = params[0].value[1];
          return `${date.toLocaleDateString()}: $${value.toFixed(2)}`;
        },
        axisPointer: {
          animation: false,
        },
      },
      grid: {
        left: 0,
        right: 0,
        top: "10%",
        bottom: "10%",
        containLabel: false,
      },
      xAxis: {
        type: "time",
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: "transparent",
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "100%"],
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: "transparent",
          formatter: (value: number) => `$${value}`,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        {
          name: "Token Value",
          type: "line",
          showSymbol: false,
          data: data.map((item) => [item.timestamp, item.value]),
          itemStyle: {
            color: "#4ade80",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(74, 222, 128, 0.5)",
                },
                {
                  offset: 1,
                  color: "rgba(74, 222, 128, 0.05)",
                },
              ],
            },
          },
        },
      ],
    };
  };

  return (
    <div className="w-full">
      {/* <ReactECharts
        option={getOption()}
        style={{ height: "84px", width: "100%" }}
        opts={{ renderer: "svg" }}
      /> */}
    </div>
  );
};

export default AccountGrowthChart;
