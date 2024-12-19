import { useState } from "react";
import HorizontalDivider from "../common/HorizontalDivider";
import EntryCard from "./EntryCard";
import ModalV2 from "../common/ModalV2";
import { TabType, CollateralType } from "@/types/earn";

interface StatItemProps {
  iconSrc: string;
  label: string;
  value: string;
  subValue?: string;
  altText: string;
}

const StatItem = ({
  iconSrc,
  label,
  value,
  subValue,
  altText,
}: StatItemProps) => (
  <>
    <div className="flex items-center gap-4 px-4 py-2">
      <img src={iconSrc} alt={altText} />
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-text">{label}</p>
        <p className="text-white text-base font-bold">
          {value}
          {subValue && (
            <span className="text-xs text-gray-text font-medium">
              {subValue}
            </span>
          )}
        </p>
      </div>
    </div>
    <HorizontalDivider />
  </>
);

const EarnSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>("deposit");
  const [collateralType, setCollateralType] = useState<CollateralType>("SOL");
  const [amount, setAmount] = useState<string>("0");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const isDeposit = activeTab === "deposit";

  return (
    <div className="w-full p-6 flex gap-4">
      {/* Earning Stats */}
      <div className="w-full md:w-[60%] bg-button-grad p-0.5 rounded-7 ">
        <div className="flex flex-col gap-2 w-full h-full bg-card-grad rounded-7 justify-around">
          <div className="px-4 py-2">
            <p className="text-white text-base font-bold">My Earning Vault</p>
          </div>
          <HorizontalDivider />
          <StatItem
            iconSrc="/img/earn/solana-wallet.svg"
            label="My Deposits"
            value="$12,000"
            altText="solana-wallet"
          />
          <StatItem
            iconSrc="/img/earn/upwards-bars.svg"
            label="Current APR"
            value="20.69%"
            altText="Increasing bar graph"
          />
          <StatItem
            iconSrc="/img/earn/earning-diamond.svg"
            label="Estimated 30d Earnings"
            value="$150.69"
            altText="Earning diamond"
          />
        </div>
      </div>

      {/* Entry Section */}
      <EntryCard
        isDeposit={isDeposit}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collateralType={collateralType}
        setCollateralType={setCollateralType}
        amount={amount}
        setAmount={setAmount}
        handleCardClick={() => setIsModalOpen(true)}
        setIsModalOpen={setIsModalOpen}
      />

      <ModalV2 isOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <EntryCard
          isDeposit={isDeposit}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collateralType={collateralType}
          setCollateralType={setCollateralType}
          amount={amount}
          setAmount={setAmount}
          isModalForm
          handleCardClick={() => setIsModalOpen(true)}
          setIsModalOpen={setIsModalOpen}
        />
      </ModalV2>
    </div>
  );
};

export default EarnSection;
