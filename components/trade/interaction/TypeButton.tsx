import React from "react";

const TypeButton = ({
  type,
  isActive,
  onClick,
}: {
  type: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    className={`rounded-lg text-base px-4 py-3 ${
      isActive ? "bg-dark-2 text-white" : "text-printer-gray"
    }`}
    onClick={onClick}
  >
    {type}
  </button>
);

export default TypeButton;
