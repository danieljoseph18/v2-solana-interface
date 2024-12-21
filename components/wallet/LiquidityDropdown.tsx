"use client";

import React, { useState, useRef, useEffect } from "react";
import TokenLogo from "../common/TokenLogo";
import { FaChevronDown } from "react-icons/fa";

const LiquidityDropdown = ({
  headerElement,
  selectedToken,
  tokenOptions,
  setSelectedToken,
}: {
  headerElement: React.ReactNode;
  selectedToken: string;
  tokenOptions: string[];
  setSelectedToken: (token: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      {headerElement}
      <div
        className="flex items-center justify-between w-full bg-white-card-grad p-4 rounded-[53px] border-white border-2 px-8 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-black">
          <TokenLogo
            tokenSymbol={selectedToken}
            showBracket={false}
            showSymbol={false}
          />
          <p className="font-medium">{selectedToken}</p>
        </div>
        <FaChevronDown className="text-black" />
      </div>
      {isOpen && (
        <ul className="absolute z-50 mt-1 w-full bg-dropdown-grad shadow-lg rounded-3 text-sm border-[#282F39] border-2 font-semibold">
          {tokenOptions.map((option: string) => (
            <li
              key={option}
              onClick={() => {
                setSelectedToken(option);
                setIsOpen(false);
              }}
              className="px-4 py-2 w-full rounded-md flex flex-row items-center gap-2 cursor-pointer hover:bg-p3-button-hover border-transparent border-2 hover:border-p3"
            >
              <TokenLogo
                tokenSymbol={option}
                showBracket={false}
                showSymbol={false}
              />
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LiquidityDropdown;
