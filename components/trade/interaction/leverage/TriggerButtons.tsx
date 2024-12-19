import NumberInput from "@/components/common/NumberInput";
import React, { useState } from "react";

interface TriggerButtonsProps {
  onChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  isLongPosition: boolean;
  customPrice: string;
  setCustomPrice: (value: string) => void;
}

const TriggerButtons: React.FC<TriggerButtonsProps> = ({
  onChange,
  onPriceChange,
  isLongPosition,
  customPrice,
  setCustomPrice,
}) => {
  const options = ["25%", "50%", "75%", "100%", "Custom"];
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [customValue, setCustomValue] = useState<string>("");
  const [triggerPriceEntered, setTriggerPriceEntered] =
    useState<boolean>(false);

  const handleButtonClick = (value: string) => {
    setSelectedOption(value);
    setCustomValue("");
    const event = {
      target: { value: value === "Custom" ? customValue : value },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event.target.value);
  };

  const handleCustomValueChange = (value: string) => {
    setSelectedOption("Custom");
    setCustomValue(value);
    onChange(value);
  };

  const handleCustomValueBlur = () => {
    let value = customValue;
    if (value === "" || isNaN(Number(value))) {
      setCustomValue(value);
      return;
    }
    const numericValue = parseFloat(value);
    if (numericValue > 100) {
      value = "100.00";
    } else if (numericValue < 0) {
      value = "0.00";
    } else {
      value = numericValue.toFixed(2);
    }
    setCustomValue(value);
    const newEvent = {
      target: { value },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(newEvent.target.value);
  };

  const handleCustomPriceChange = (value: string) => {
    setCustomPrice(value);
    setTriggerPriceEntered(value !== "");
    onPriceChange(value);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {options.map((option) => (
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
            {option !== "Custom" ? (
              <button
                onClick={() => handleButtonClick(option)}
                className={`py-2 px-3 bg-input-grad text-printer-gray w-full h-full rounded`}
              >
                {option}
              </button>
            ) : (
              <NumberInput
                value={customValue}
                onValueChange={handleCustomValueChange}
                onBlur={handleCustomValueBlur}
                placeholder="%"
                className="p-2 bg-input-grad text-printer-gray focus:outline-none w-full h-full rounded text-center"
              />
            )}
          </div>
        ))}
      </div>
      <div
        className={`p-[2px] rounded ${
          triggerPriceEntered
            ? isLongPosition
              ? "bg-green-grad"
              : "bg-red-grad"
            : "bg-cardborder"
        }`}
      >
        <NumberInput
          value={customPrice}
          onValueChange={handleCustomPriceChange}
          placeholder="Trigger Price"
          className="px-2 py-3 bg-input-grad text-printer-gray focus:outline-none w-full h-full rounded text-center"
        />
      </div>
    </div>
  );
};

export default TriggerButtons;
