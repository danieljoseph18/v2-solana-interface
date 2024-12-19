import React from "react";
import Image from "next/image";
import NumberInput from "@/components/common/NumberInput";
import CustomSelect from "./CustomSelect";
import { getImageUrlfromTokenSymbol } from "@/lib/utils/getTokenImage";

interface CollateralInputProps {
  value: string;
  onValueChange: (value: string) => void;
  collateralType: string;
  onCollateralTypeChange?: (option: string) => void;
  collateralOptions?: string[];
  onMaxClick: () => void;
  placeholder?: string;
  balance?: string;
  title?: string;
  showSelectCurrency?: boolean;
}

const CollateralInput: React.FC<CollateralInputProps> = ({
  value,
  onValueChange,
  collateralType,
  onCollateralTypeChange,
  collateralOptions = [],
  onMaxClick,
  placeholder = "",
  balance,
  title,
  showSelectCurrency = false,
}) => {
  return (
    <div className="flex flex-col w-full max-w-screen bg-input-grad border-cardborder border-3 p-4">
      <div className="flex justify-between items-center w-full mb-2 text-printer-gray">
        {title && <p className="text-xs">{title}</p>}
        {balance && (
          <p className="text-xs">
            Balance: <span className="font-medium">{balance}</span>
          </p>
        )}
      </div>
      <div className="flex justify-between items-center w-full">
        <NumberInput
          onValueChange={onValueChange}
          value={value}
          placeholder={placeholder}
          className="text-sm text-printer-gray md:text-lg font-bold focus:outline focus:outline-none bg-transparent text-left overflow-x-hidden !max-w-[30%] !md:max-w-full"
        />
        <div className="flex flex-row gap-2 md:gap-4 items-center justify-between">
          <button
            className="flex items-center justify-center text-center text-xs bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 text-white font-bold px-3 py-1 shadow-[4px_4px_10px_rgba(0,0,0,0.3)] ml-2"
            onClick={onMaxClick}
          >
            MAX
          </button>
          <div className="flex flex-row items-center gap-2 ml-2">
            <Image
              src={getImageUrlfromTokenSymbol(collateralType)}
              alt={`${collateralType} Token`}
              width={24}
              height={24}
              className="rounded-full"
            />
            {showSelectCurrency && collateralOptions.length > 0 ? (
              <CustomSelect
                options={collateralOptions}
                selectedOption={collateralType}
                onOptionSelect={onCollateralTypeChange || (() => {})}
                showImages={true}
                showText={false}
              />
            ) : (
              <span className="hidden md:block font-bold text-printer-gray">
                {collateralType}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollateralInput;
