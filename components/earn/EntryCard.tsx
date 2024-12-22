import { BsCreditCardFill } from "react-icons/bs";
import PoolToggles from "./PoolToggles";
import { CollateralType, TabType } from "@/types/earn";
import { getImageUrlFromTokenSymbol } from "@/lib/utils/getTokenImage";
import AssetDropdown from "../common/AssetDropdown";
import { COLLATERAL_OPTIONS } from "@/lib/constants";
import NumberInput from "../common/NumberInput";
import ModalClose from "../common/ModalClose";
import { Button } from "@nextui-org/react";

const EntryCard = ({
  isDeposit,
  activeTab,
  setActiveTab,
  collateralType,
  setCollateralType,
  amount,
  setAmount,
  isModalForm = false,
  handleCardClick,
  setIsModalOpen,
}: {
  isDeposit: boolean;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  collateralType: CollateralType;
  setCollateralType: (collateral: CollateralType) => void;
  amount: string;
  setAmount: (amount: string) => void;
  isModalForm?: boolean;
  handleCardClick?: () => void;
  setIsModalOpen?: (isOpen: boolean) => void;
}) => {
  return (
    <div className="hidden md:flex flex-1 bg-button-grad p-0.5 rounded-7 ">
      <div className="flex flex-col gap-2 w-full h-full bg-card-grad rounded-7 p-4">
        {/* Deposit and Withdraw Buttons */}
        <div className="flex flex-row items-center gap-2">
          <PoolToggles activeTab={activeTab} setActiveTab={setActiveTab} />
          {isModalForm && setIsModalOpen && (
            <ModalClose onClose={() => setIsModalOpen(false)} />
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex w-full items-center justify-between">
            <p className="text-gray-text text-sm">
              {isDeposit ? "Deposit" : "Withdraw"}
            </p>
            {isDeposit && !isModalForm && (
              <button
                className="flex items-center gap-1 text-printer-orange text-sm font-bold hover:opacity-80 cursor-pointer"
                onClick={handleCardClick}
              >
                <BsCreditCardFill />
                <p>Deposit with Card</p>
              </button>
            )}
          </div>
        </div>

        {/* Asset Selection Dropdown */}
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
              <p className="text-white text-base font-light">
                {collateralType}
              </p>
            </div>
            <AssetDropdown
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

        <div className="flex flex-col gap-2 w-full">
          <div className="flex w-full items-center justify-between">
            <p className="text-gray-text text-sm">Amount</p>
            <div className="flex items-center gap-2">
              <img
                src="/img/earn/solana-wallet.svg"
                alt="solana-wallet"
                className="w-4"
              />
              <p className="text-white font-medium text-xs">$100.00</p>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center h-[64px]">
          <div className="flex items-center justify-between bg-card-grad h-[64px] border-cardborder border-2 rounded-7 px-3 py-4 w-full">
            <div className="flex gap-1 items-center w-fit max-w-[30%]">
              <p className="text-white font-bold text-sm md:text-lg">$</p>
              <NumberInput
                value={amount}
                onValueChange={setAmount}
                className="text-sm text-white md:text-lg font-bold focus:outline focus:outline-none bg-transparent text-left overflow-x-auto w-[150px] lg:w-[60px] xl:w-[150px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button className="bg-button-grad hover:bg-button-grad-hover !min-w-[38px] !w-[38px] hidden md:flex !h-[30px] !min-h-[30px] text-13 md:text-15 rounded-3 border-2 border-printer-orange">
                MAX
              </Button>
            </div>
          </div>
        </div>

        <Button
          className={`w-full !h-[48px] mt-4 rounded-3 border-2 ${
            isDeposit
              ? "bg-green-grad hover:bg-green-grad-hover border-printer-green"
              : "bg-red-grad hover:bg-red-grad-hover border-printer-red"
          }`}
        >
          {isDeposit ? "Deposit" : "Withdraw"}
        </Button>
      </div>
    </div>
  );
};

export default EntryCard;
