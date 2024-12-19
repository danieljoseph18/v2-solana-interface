import { getImageUrlFromTokenSymbol } from "@/lib/utils/getTokenImage";
import React, { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

type AssetSelectProps = {
  options: string[];
  selectedOption: string;
  onOptionSelect: (option: string) => void;
  showImages: boolean;
  showText: boolean;
  defaultDisplay?: string | React.ReactNode;
  hideDropdownArrow?: boolean;
  positionAbove?: boolean;
  textStyling?: string;
  getOptionLabel?: (option: string) => string;
};

const AssetSelect: React.FC<AssetSelectProps> = ({
  options,
  selectedOption,
  onOptionSelect,
  showImages,
  showText,
  defaultDisplay,
  hideDropdownArrow,
  positionAbove = false,
  textStyling,
  getOptionLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: string) => {
    onOptionSelect(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getDisplayLabel = (option: string) => {
    if (getOptionLabel) {
      return getOptionLabel(option);
    }
    return option;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={
          textStyling
            ? textStyling
            : "bg-transparent rounded text-printer-gray font-bold flex items-center justify-between gap-2"
        }
      >
        {showText
          ? defaultDisplay
            ? defaultDisplay
            : getDisplayLabel(selectedOption)
          : null}
        {!hideDropdownArrow && <FaChevronDown className="text-white" />}
      </button>
      {isOpen && (
        <ul
          className={`absolute z-50 ${
            positionAbove ? "bottom-full mb-1" : "top-full mt-1"
          } right-0 w-[200px] bg-black-one shadow-lg rounded-3 text-sm border-[#282F39] border-2 font-semibold`}
        >
          {options.map((option: string) => (
            <li
              key={option}
              onClick={() => handleOptionClick(option)}
              className="px-4 py-2 w-full rounded-md flex flex-row items-center gap-2 cursor-pointer hover:bg-button-grad border-transparent border-2 hover:border-sol-purple"
            >
              {showImages && (
                <img
                  src={getImageUrlFromTokenSymbol(option)}
                  alt={`${option} Token`}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              {getDisplayLabel(option)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssetSelect;
