import React from "react";

const ToggleSwitch = ({
  value,
  setValue,
  label,
  fullWidth,
}: {
  value: boolean;
  setValue: (value: boolean) => void;
  label: string;
  fullWidth?: boolean;
}) => {
  return (
    <label
      className={`inline-flex items-center ${
        fullWidth ? "w-full justify-between" : "gap-2"
      } cursor-pointer`}
    >
      <span className="text-[15px] font-medium text-gray-text">{label}</span>
      <div className="flex items-center">
        <input
          type="checkbox"
          value=""
          className="sr-only peer"
          checked={value}
          onChange={() => setValue(!value)}
        />
        <div className="relative w-10 h-5 rounded-full peer border-cardborder border-2 bg-gradient-to-b from-input-top to-input-bottom peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[-2px] after:left-[-1px] after:bg-[#E9EDF0] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:from-printer-orange peer-checked:to-printer-light-orange"></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;
