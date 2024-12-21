import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import WalletSwiper from "./WalletSwiper";
import { FaArrowRight } from "react-icons/fa";

interface InitialViewProps {
  onLoginClick: () => void;
  closeAccountOverlay: () => void;
}

const InitialView = ({
  onLoginClick,
  closeAccountOverlay,
}: InitialViewProps) => {
  const [isLastSlide, setIsLastSlide] = useState(false);

  const handleLastSlideReached = (isLast: boolean) => {
    setIsLastSlide(isLast);
  };

  return (
    <div className="min-h-screen bg-card-grad text-white p-4">
      <div className="flex justify-between items-center mb-6">
        {/* Empty Div to Push Close button Right */}
        <div></div>
        {/* Used to Hide Slide the Pop-up Back Right */}
        <div className="flex items-center justify-center bg-input-grad border-2 border-cardborder rounded-3 p-3 hover:opacity-80 transition-opacity cursor-pointer">
          <FaArrowRight className="text-white" onClick={closeAccountOverlay} />
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <WalletSwiper onLastSlideReached={handleLastSlideReached} />
        <Button
          size="lg"
          className={`flex items-center justify-center text-center text-base bg-green-grad hover:bg-green-grad-hover border-2 border-printer-green rounded-[53px] text-white !py-4 md:py-6 font-medium ${
            !isLastSlide ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onPress={onLoginClick}
          disabled={!isLastSlide}
        >
          Create PRINT3R Wallet
        </Button>
      </div>
    </div>
  );
};

export default InitialView;
