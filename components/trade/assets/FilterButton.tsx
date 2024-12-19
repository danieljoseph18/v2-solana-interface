import React from "react";

const FilterButton: React.FC<{
  title: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ title, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`py-0.5 px-2 font-semibold text-sm text-nowrap ${
        isActive
          ? "text-printer-orange border-cardborder border-2 rounded bg-card-grad"
          : "text-base-gray"
      }`}
    >
      {title}
    </button>
  );
};

export default FilterButton;
