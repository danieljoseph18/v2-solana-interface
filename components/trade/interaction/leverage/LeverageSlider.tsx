import React, { useEffect, useState } from "react";
import { Slider } from "@nextui-org/react";

interface LeverageSliderProps {
  min: number;
  max: number;
  step: number;
  initialValue: number;
  value?: number;
  onChange: (value: number) => void;
  isLongPosition: boolean;
  unit: string;
}

const LeverageSlider: React.FC<LeverageSliderProps> = ({
  min,
  max,
  step,
  initialValue,
  value,
  onChange,
  isLongPosition,
  unit,
}) => {
  const [internalValue, setInternalValue] = useState(initialValue);

  const handleChange = (newValue: number | number[]) => {
    const updatedValue = Array.isArray(newValue) ? newValue[0] : newValue;
    setInternalValue(updatedValue);
    onChange(updatedValue);
  };

  const displayValue = value !== undefined ? value : internalValue;

  return (
    <Slider
      step={step}
      maxValue={max}
      minValue={min}
      value={displayValue}
      onChange={handleChange}
      defaultValue={initialValue}
      renderThumb={(props: any) => (
        <div
          {...props}
          className="group p-1 top-1/2 py-1 px-2 rounded-lg shadow-xl text-white text-sm bg-[#242736] cursor-grab data-[dragging=true]:cursor-grabbing"
        >
          <span className="transition-transform  w-full h-full block group-data-[dragging=true]:scale-80">
            {`${displayValue}${unit}`}
          </span>
        </div>
      )}
      color="foreground"
      classNames={{
        base: "w-full",
        track: `bg-input-grad border-none`,
        filler: `bg-gradient-to-r rounded-full w-full ${
          isLongPosition
            ? "from-printer-green to-green-bottom"
            : "from-printer-red to-red-bottom"
        }`,
        mark: "text-white",
        thumb: "relative top-0",
      }}
    />
  );
};

export default LeverageSlider;
