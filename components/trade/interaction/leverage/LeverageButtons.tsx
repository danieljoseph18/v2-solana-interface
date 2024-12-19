import React, { useState } from "react";

interface LeverageButtonsProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  maxLeverage: number;
  isLongPosition: boolean;
}

const CUSTOM_OPTION = 1001;

const LeverageButtons: React.FC<LeverageButtonsProps> = ({
  onChange,
  maxLeverage,
  isLongPosition,
}) => {
  const leverageOptions = [2, 5, 10, 100];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [customLeverage, setCustomLeverage] = useState<string>("");

  const handleButtonClick = (value: number) => {
    if (value <= maxLeverage) {
      setSelectedOption(value);
      setCustomLeverage("");
      const event = {
        target: { value: value.toString() },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  const handleCustomLeverageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const numValue = parseFloat(value);

    if (
      value === "" ||
      ((numValue >= 1.1 || numValue <= maxLeverage) &&
        /^\d*\.?\d{0,2}$/.test(value))
    ) {
      setSelectedOption(CUSTOM_OPTION);
      setCustomLeverage(value);
      onChange(event);
    }
  };

  const handleBlur = () => {
    let numValue = parseFloat(customLeverage);
    if (isNaN(numValue)) {
      setCustomLeverage("");
    } else if (numValue < 1.1) {
      setCustomLeverage("1.10");
      onChange({
        target: { value: "1.10" },
      } as React.ChangeEvent<HTMLInputElement>);
    } else if (numValue > maxLeverage) {
      setCustomLeverage(maxLeverage.toString());
      onChange({
        target: { value: maxLeverage.toString() },
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      setCustomLeverage(numValue.toFixed(2));
      onChange({
        target: { value: numValue.toFixed(2) },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="flex gap-2">
      {leverageOptions.map((option) => (
        <div
          key={option}
          className={`p-[2px] rounded ${
            selectedOption === option
              ? isLongPosition
                ? "bg-green-grad"
                : "bg-red-grad"
              : "bg-cardborder"
          }`}
        >
          <button
            onClick={() => handleButtonClick(option)}
            disabled={option > maxLeverage}
            className={`py-2 px-3 bg-input-grad text-printer-gray w-full h-full rounded ${
              option > maxLeverage ? "opacity-30 cursor-not-allowed" : ""
            }`}
          >
            {option}x
          </button>
        </div>
      ))}
      <div
        className={`p-[2px] w-full rounded ${
          selectedOption === CUSTOM_OPTION
            ? isLongPosition
              ? "bg-green-grad"
              : "bg-red-grad"
            : "bg-cardborder"
        }`}
      >
        <input
          type="number"
          value={customLeverage}
          onChange={handleCustomLeverageChange}
          placeholder="x"
          className="p-2 bg-input-grad text-printer-gray focus:outline-none w-full h-full rounded text-center"
          onBlur={handleBlur}
          min="1.10"
          step="0.01"
          max={maxLeverage}
        />
      </div>
    </div>
  );
};

export default LeverageButtons;
