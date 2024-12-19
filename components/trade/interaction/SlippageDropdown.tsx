import React, { useState, useRef, useEffect } from "react";
import { BsChevronDown } from "react-icons/bs";

const SlippageDropdown = ({
  options,
  selectedOption,
  onOptionSelect,
}: {
  options: string[];
  selectedOption: string;
  onOptionSelect: (option: string) => void;
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
    <div className="relative inline-block" ref={dropdownRef}>
      <div
        className="flex items-center justify-between bg-transparent border border-white rounded-full px-4 py-1 text-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption}%</span>
        <BsChevronDown
          className={`ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-input-grad border border-cardborder rounded-lg shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              className="px-4 py-2 text-white hover:bg-input-grad cursor-pointer"
              onClick={() => {
                onOptionSelect(option);
                setIsOpen(false);
              }}
            >
              {option}%
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlippageDropdown;
