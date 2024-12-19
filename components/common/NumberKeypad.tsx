import { FaBackspace } from "react-icons/fa";

type NumberKeypadProps = {
  onValueChange: (value: string) => void;
  value: string;
};

const NumberKeypad = ({ onValueChange, value }: NumberKeypadProps) => {
  const handleNumberClick = (num: string) => {
    if (value === "0") {
      onValueChange(num);
    } else {
      onValueChange(value + num);
    }
  };

  const handleDecimalClick = () => {
    if (!value.includes(".")) {
      onValueChange(value + ".");
    }
  };

  const handleDeleteClick = () => {
    if (value.length > 1) {
      onValueChange(value.slice(0, -1));
    } else {
      onValueChange("0");
    }
  };

  const buttons = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ".",
    "0",
    "delete",
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-4">
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={() => {
              if (btn === ".") handleDecimalClick();
              else if (btn === "delete") handleDeleteClick();
              else handleNumberClick(btn);
            }}
            className="bg-gradient-to-b from-[#F5F5F5] to-[#B1B1B1] text-sexy-gray text-5xl font-semibold py-4 rounded-lg shadow-md hover:from-[#B1B1B1] hover:to-[#F5F5F5] transition-colors duration-200 border-2 border-white"
          >
            {btn === "delete" ? (
              <FaBackspace className="text-5xl text-sexy-gray mx-auto" />
            ) : (
              btn
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberKeypad;
