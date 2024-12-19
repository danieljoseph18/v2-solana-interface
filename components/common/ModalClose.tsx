import React from "react";

const ModalClose = ({
  onClose,
  style = "default",
}: {
  onClose: () => void;
  style?: "default" | "secondary";
}) => {
  return (
    <button
      onClick={onClose}
      className={`relative w-[38px] h-[38px] ${
        style === "secondary"
          ? "bg-input-grad border-cardborder border-2 rounded shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out before:content-[''] after:content-[''] before:absolute after:absolute before:bg-printer-orange after:bg-printer-orange before:w-[55%] after:w-[55%] before:h-[2px] after:h-[2px] before:top-[48%] after:top-[48%] before:left-[22%] after:left-[22%] before:rotate-45 after:-rotate-45 before:transition-transform after:transition-transform before:duration-300 after:duration-300 hover:before:rotate-180 hover:after:rotate-180"
          : "bg-card-grad border-cardborder border-2 rounded shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out before:content-[''] after:content-[''] before:absolute after:absolute before:bg-printer-orange after:bg-printer-orange before:w-[55%] after:w-[55%] before:h-[2px] after:h-[2px] before:top-[48%] after:top-[48%] before:left-[22%] after:left-[22%] before:rotate-45 after:-rotate-45 before:transition-transform after:transition-transform before:duration-300 after:duration-300 hover:before:rotate-180 hover:after:rotate-180"
      }`}
    ></button>
  );
};

export default ModalClose;
