import React from "react";
import TypeButton from "./TypeButton";

const entryTypes = ["Market", "Limit"];

const exitTypes = ["Market", "Stop Loss", "Take Profit"];

interface TypeButtonsProps {
  activeType: string;
  setActiveType: (type: string) => void;
  isEntry: boolean;
}

const TypeButtons: React.FC<TypeButtonsProps> = ({
  activeType,
  setActiveType,
  isEntry,
}) => {
  return (
    <div className="flex flex-row gap-2">
      {isEntry
        ? entryTypes.map((type) => (
            <TypeButton
              key={type}
              type={type}
              isActive={activeType === type}
              onClick={() => setActiveType(type)}
            />
          ))
        : exitTypes.map((type) => (
            <TypeButton
              key={type}
              type={type}
              isActive={activeType === type}
              onClick={() => setActiveType(type)}
            />
          ))}
    </div>
  );
};

export default TypeButtons;
