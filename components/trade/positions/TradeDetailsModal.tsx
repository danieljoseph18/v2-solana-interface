import React, { useEffect, useState } from "react";
import { FaShareSquare } from "react-icons/fa";
import { getLiqPrice } from "./helpers";
import TokenLogo from "@/components/common/TokenLogo";
import { getImageUrlfromTokenSymbol } from "@/lib/utils/getTokenImage";
import { Button } from "@nextui-org/react";
import ModalClose from "@/components/common/ModalClose";
import { formatSmallNumber, getPriceDecimals } from "@/lib/web3/formatters";
import ModalV2 from "@/components/common/ModalV2";
import TradeShare from "./TradeShare";

const TradeDetailsModal = ({
  position,
  profitLoss,
  markPrice,
  handleCloseClick,
  handleOptionClick,
  onClose,
}: {
  position: Position;
  profitLoss: {
    pnlUsd: string;
    pnlPercentage: string;
    hasProfit: boolean;
  };
  markPrice: number;
  handleCloseClick: (trade: Position) => void;
  handleOptionClick: (
    option: "Deposit Collateral" | "Withdraw Collateral"
  ) => void;
  onClose: () => void;
}) => {
  const [priceDecimals, setPriceDecimals] = useState(7);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const iconUrl = getImageUrlfromTokenSymbol(position.symbol);

  useEffect(() => {
    const fetchPriceDecimals = async () => {
      const decimals = getPriceDecimals(markPrice);
      setPriceDecimals(decimals);
    };
    fetchPriceDecimals();
  }, [position]);

  // size / collateral
  const getLeverage = () => {
    return (position.size / position.collateral).toFixed(2);
  };

  return (
    <div className="flex flex-col gap-4 px-4 pt-2 justify-around h-full py-10">
      <div className="w-full flex items-center justify-between">
        <p className="text-lg font-medium max-w-[80%]">
          Manage Position:{" "}
          <span className="text-printer-orange font-bold">
            {position.symbol.split(":")[0]} / USD{" "}
          </span>
          <span
            className={`text-sm  ${
              position.isLong ? "text-printer-green" : "text-printer-red"
            }`}
          >{`${position.isLong ? "Long" : "Short"}`}</span>
        </p>
        <ModalClose onClose={onClose} />
      </div>
      <div className="flex justify-between text-base text-printer-gray ">
        <span>Size </span>
        <span>{`${position.size.toFixed(2)} USD`}</span>
      </div>
      <div className="flex justify-between text-base text-printer-gray">
        <span>Collateral </span>
        <div className="flex flex-col">
          <span className="text-xs text-end">{`$${position.collateral.toFixed(
            2
          )}`}</span>
          <span
            className={`text-xs ${
              profitLoss.hasProfit ? "text-printer-green" : "text-printer-red"
            }`}
          >{`${profitLoss.pnlUsd} (${profitLoss.pnlPercentage})`}</span>
        </div>
      </div>
      <div className="flex justify-between text-base text-printer-gray">
        <span>Leverage </span>
        <span>{`${getLeverage()}X`}</span>
      </div>
      <div className="flex justify-between text-base text-printer-gray">
        <span>Mark Price </span>
        <span>{`$${markPrice}`}</span>
      </div>
      <div className="flex justify-between text-base text-printer-gray">
        <span>Entry Price </span>
        <span>{`$${formatSmallNumber(position.entryPrice)}`}</span>
      </div>
      <div className="flex justify-between text-base text-printer-gray">
        <span>Liquidation Price </span>
        <span>{`$${getLiqPrice(position)}`}</span>
      </div>
      <div className="flex justify-between text-base text-printer-gray">
        <span>Collateral Asset</span>
        <TokenLogo
          tokenSymbol={position.isLong ? "ETH" : "USDC"}
          tokenImageClass="w-5 h-5 rounded-full"
        />
      </div>
      <div className="flex justify-between items-center mt-4 text-sm">
        <FaShareSquare
          className="text-printer-orange text-xl cursor-pointer"
          onClick={() => setIsShareModalOpen(true)}
        />
        <button
          onClick={() => handleOptionClick("Deposit Collateral")}
          className="bg-transparent cursor-pointer text-printer-orange  hover:text-white px-2 py-1 rounded"
        >
          Deposit
        </button>
        <button
          onClick={() => handleOptionClick("Withdraw Collateral")}
          className="bg-transparent cursor-pointer text-printer-orange  hover:text-white px-2 py-1 rounded"
        >
          Withdraw
        </button>
        <Button
          onClick={() => handleCloseClick(position)}
          className="cursor-pointer bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3  font-bold hover:scale-105 text-white px-4 py-2"
        >
          Close
        </Button>
      </div>
      <ModalV2 isOpen={isShareModalOpen} setIsModalOpen={setIsShareModalOpen}>
        <TradeShare
          position={position.symbol.split(":")[0]}
          pnlPercentage={parseFloat(profitLoss.pnlPercentage)}
          entryPrice={position.entryPrice}
          currentPrice={markPrice}
          assetLogo={getImageUrlfromTokenSymbol(position.symbol.split(":")[0])}
          isLong={position.isLong}
          leverage={parseFloat(getLeverage())}
          onClose={() => setIsShareModalOpen(false)}
          isClosed={false}
        />
      </ModalV2>
    </div>
  );
};

export default TradeDetailsModal;
