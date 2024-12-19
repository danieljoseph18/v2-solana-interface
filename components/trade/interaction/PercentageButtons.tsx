import React from "react";

const PercentageButtons = ({
  title,
  options,
  isLong,
  selectedOption,
  setSelectedOption,
  customValue,
  setCustomValue,
}: {
  title: string;
  options: string[];
  isLong: boolean;
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  customValue: string;
  setCustomValue: (value: string) => void;
}) => {
  // Handle button click
  const handleButtonClick = (value: string) => {
    setSelectedOption(value);
    setCustomValue("");
  };

  // Handle custom value change
  const handleCustomValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedOption("Custom");
    setCustomValue(event.target.value);
  };

  // Handle custom value blur
  const handleCustomValueBlur = () => {
    let value = customValue;
    if (value === "" || isNaN(Number(value))) {
      setCustomValue("");
      return;
    }
    let numericValue = parseFloat(value);
    if (numericValue < 0.1) {
      numericValue = 0.1;
    } else if (numericValue > 100.0) {
      numericValue = 100.0;
    }
    value = numericValue.toFixed(2);
    setCustomValue(value);
  };

  return (
    <>
      <p className="text-[15px] font-medium text-gray-text">{title}</p>
      <div className="flex gap-2">
        {options.map((option) => (
          <div
            key={option}
            className={`p-[2px] rounded ${
              selectedOption === option
                ? isLong
                  ? "bg-green-grad"
                  : "bg-red-grad"
                : "bg-cardborder"
            }`}
          >
            {option !== "Custom" ? (
              <button
                onClick={() => handleButtonClick(option)}
                className={`py-2 px-3 bg-input-grad text-printer-gray w-full h-full rounded text-sm md:text-base`}
              >
                {`${option}%`}
              </button>
            ) : (
              <input
                type="number"
                value={customValue}
                onChange={handleCustomValueChange}
                onBlur={handleCustomValueBlur}
                placeholder="%"
                className="p-2 bg-input-grad text-printer-gray focus:outline-none w-full h-full rounded text-center text-base"
                style={{
                  touchAction: "manipulation",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default PercentageButtons;
