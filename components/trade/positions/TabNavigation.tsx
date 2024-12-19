import React from "react";
import Tab from "@/components/common/Tab";
import ChartOptions from "./ChartOptions";

const TabNavigation = ({
  activeTab,
  setActiveTab,
  chartPositions,
  setChartPositions,
  currentMarketOnly,
  setCurrentMarketOnly,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  chartPositions: boolean;
  setChartPositions: (chartPositions: boolean) => void;
  currentMarketOnly: boolean;
  setCurrentMarketOnly: (currentMarketOnly: boolean) => void;
}) => {
  const tabs = [
    { name: "My Trades", trend: "up" },
    { name: "Orders", trend: "down" },
    { name: "History", trend: "" },
  ];

  return (
    <div className="flex flex-col-reverse gap-4 xl:flex-row sm:gap-0 justify-between px-2 bg-card-grad lg:pl-6 py-4 lg:pr-6 xl:m-0 max-w-full">
      <div className="flex flex-row mt-6 xl:mt-0">
        {tabs.map((tab, index) => (
          <Tab
            key={tab.name}
            name={tab.name}
            isActive={activeTab === tab.name}
            onClick={() => setActiveTab(tab.name)}
            trend={tab.trend}
            position={
              index === 0
                ? "first"
                : index === tabs.length - 1
                ? "last"
                : "middle"
            }
          />
        ))}
      </div>
      <ChartOptions
        shouldShow={true}
        chartPositions={chartPositions}
        setChartPositions={setChartPositions}
        currentMarketOnly={currentMarketOnly}
        setCurrentMarketOnly={setCurrentMarketOnly}
      />
    </div>
  );
};

export default TabNavigation;
