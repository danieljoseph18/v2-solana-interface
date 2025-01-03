import { TabType } from "@/types/earn";
import { Button } from "@nextui-org/react";

const PoolToggles = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}) => {
  const getTabStyles = (isActive: boolean, isDeposit: boolean): string => {
    return `${
      isActive
        ? `text-white ${
            isDeposit
              ? "border-2 border-printer-green bg-green-grad hover:bg-green-grad-hover"
              : "border-2 border-printer-red bg-red-grad hover:bg-red-grad-hover"
          }`
        : "bg-transparent text-gray-text"
    } px-4 py-3 w-full text-center rounded-full font-bold text-xs hover:opacity-80`;
  };

  return (
    <div className="flex items-center bg-input-grad w-full rounded-full border-2 border-cardborder">
      {["deposit", "withdraw"].map((tab) => {
        const isActive = activeTab === tab;
        const styles = getTabStyles(isActive, tab === "deposit");
        return (
          <Button
            key={`${tab}-toggle`}
            className={styles}
            onPress={() => setActiveTab(tab as TabType)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        );
      })}
    </div>
  );
};

export default PoolToggles;
