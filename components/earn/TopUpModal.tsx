import { useState } from "react";
import PoolToggles from "./PoolToggles";
import ModalClose from "../common/ModalClose";
import NumberInput from "../common/NumberInput";
import AssetSelect from "../common/AssetDropdown";
import { getImageUrlFromTokenSymbol } from "@/lib/utils/getTokenImage";
import { CollateralType, TabType } from "@/types/earn";
import { COLLATERAL_OPTIONS } from "@/lib/constants";
import NumberKeypad from "../common/NumberKeypad";
import SubmitSwiper from "../common/SubmitSwiper";
import { Checkbox, Link } from "@nextui-org/react";

const QuickTopupButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => (
  <button
    className="px-4 py-2 rounded-full bg-button-grad hover:bg-button-grad-hover text-center text-white font-medium text-sm flex-grow"
    onClick={onClick}
  >
    <p>{label}</p>
  </button>
);

const depositQuickTopupButtons = ["$10", "$20", "$50", "$100"];
const withdrawalQuickTopupButtons = ["$10", "$20", "$50", "MAX"];

const TopUpModal = ({
  setIsModalOpen,
}: {
  setIsModalOpen: (isOpen: boolean) => void;
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("deposit");
  const [wager, setWager] = useState<string>("100.00");
  const [collateralType, setCollateralType] = useState<CollateralType>("SOL");

  const handleMaxClick = () => {
    // TODO: Implement max click handler
  };

  const handleTopUpClick = (value: string) => {
    // Remove $ sign if present and update wager
    const cleanValue = value.startsWith("$") ? value.slice(1) : value;
    setWager(cleanValue);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row items-center gap-2">
        <PoolToggles activeTab={activeTab} setActiveTab={setActiveTab} />
        <ModalClose onClose={() => setIsModalOpen(false)} />
      </div>
      <div className="flex items-center w-full justify-between gap-4">
        <div className="flex items-center w-full">
          <span className="text-white text-6xl">$</span>
          <NumberInput
            value={wager}
            onValueChange={(value) => setWager(value)}
            className="bg-transparent !text-white focus:ring-0 focus:outline-none !w-full !text-6xl"
          />
        </div>
        {activeTab === "withdraw" && (
          <div className="flex items-center gap-2">
            <img
              src="/img/earn/solana-wallet.svg"
              alt="solana-wallet"
              className="w-4"
            />
            <p className="text-white font-medium text-xs">$100.00</p>
          </div>
        )}
      </div>

      {/* Topup / Withdrawal method dropdown */}
      <p className="text-gray-text text-base font-bold">
        {activeTab === "deposit" ? "Topup Method" : "Withdrawal Method"}
      </p>
      <div className="bg-button-grad p-0.5 rounded-7">
        <div className="flex items-center gap-2 w-full justify-between rounded-7 bg-card-grad p-4">
          <div className="flex items-center gap-2">
            <img
              src={getImageUrlFromTokenSymbol(collateralType)}
              alt={`${collateralType} Token`}
              width={24}
              height={24}
              className="rounded-full"
            />
            <p className="text-white text-base font-light">{collateralType}</p>
          </div>
          <AssetSelect
            options={COLLATERAL_OPTIONS}
            selectedOption={collateralType}
            onOptionSelect={(option) =>
              setCollateralType(option as CollateralType)
            }
            showImages={true}
            showText={false}
          />
        </div>
      </div>

      {/* Quick topup buttons */}
      <div className="flex items-center justify-between w-full gap-4">
        {activeTab === "deposit"
          ? depositQuickTopupButtons.map((button) => (
              <QuickTopupButton
                key={button}
                label={button}
                onClick={() => handleTopUpClick(button)}
              />
            ))
          : withdrawalQuickTopupButtons.map((button) => (
              <QuickTopupButton
                key={button}
                label={button}
                onClick={() =>
                  button === "MAX" ? handleMaxClick() : handleTopUpClick(button)
                }
              />
            ))}
      </div>

      {/* Number keypad */}
      <NumberKeypad onValueChange={setWager} value={wager} />

      <div className="flex items-center gap-4">
        <Checkbox color="default" />
        <p>
          I have read and agree to the BIDMORE{" "}
          <Link href="" className="text-sol-blue">
            Terms & Conditions
          </Link>
        </p>
      </div>

      {/* Submit button */}
      <SubmitSwiper onSuccess={() => {}} text="Top Up" />
    </div>
  );
};

export default TopUpModal;
