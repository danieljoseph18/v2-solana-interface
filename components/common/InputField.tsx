import { ReactNode } from "react";
import NumberInput from "./NumberInput";

type Props = {
  hideMax?: boolean;
  setMax?: () => void;
  onChange?: (value: string) => void;
  value?: string;
  renderContent?: ReactNode;
  renderBalance?: ReactNode;
  renderTitle?: ReactNode;
  className?: string;
  noBorder?: boolean;
  placeHolder?: string;
  readOnly?: boolean;
};

const InputField = ({
  hideMax,
  setMax,
  onChange,
  value,
  renderContent,
  renderBalance,
  className,
  renderTitle,
  noBorder,
  placeHolder,
  readOnly = false,
}: Props) => {
  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div
      className={`flex justify-between text-printer-gray items-center p-3.5 ${
        noBorder ? "" : "bg-input-grad border border-cardborder rounded-3"
      } ${className || ""}`}
    >
      <div className="flex flex-col w-1/2 gap-2">
        <div className="flex items-center justify-between w-full">
          {renderTitle}
        </div>
        {readOnly ? (
          <input
            readOnly
            value={value}
            className="text-base text-printer-gray md:text-lg font-medium focus:outline-none bg-transparent w-full text-left"
          />
        ) : (
          <NumberInput
            onValueChange={handleChange}
            value={value}
            placeholder={placeHolder || ""}
            className="text-base text-printer-gray md:text-lg font-medium focus:outline-none bg-transparent w-full text-left"
          />
        )}
      </div>
      {renderContent && (
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center text-printer-gray text-xs gap-2">
            {renderBalance}
            {!hideMax && (
              <span
                className="font-bold text-printer-orange cursor-pointer hover:text-printer-dark-orange"
                onClick={setMax}
              >
                Max
              </span>
            )}
          </div>
          <div className="flex gap-2 items-center">{renderContent}</div>
        </div>
      )}
    </div>
  );
};

export default InputField;
