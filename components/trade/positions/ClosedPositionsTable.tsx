import React, { useState } from "react";
import { getPriceDecimals } from "@/lib/web3/formatters";
import { FaShareSquare } from "react-icons/fa";
import ModalV2 from "@/components/common/ModalV2";
import TradeShare from "./TradeShare";
import { getImageUrlfromTokenSymbol } from "@/lib/utils/getTokenImage";

interface ClosedPositionsTableProps {
  closedPositions: ClosedPosition[];
}

const ClosedPositionsTable: React.FC<ClosedPositionsTableProps> = ({
  closedPositions,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] =
    useState<ClosedPosition | null>(null);

  const getLeverage = (position: ClosedPosition) => {
    return (position.size / position.collateral).toFixed(2);
  };

  // Sort closedPositions array by entryTime, newest to oldest
  const sortedPositions = [...closedPositions].sort((a, b) => {
    return new Date(b.entryTime).getTime() - new Date(a.entryTime).getTime();
  });

  const handleShareClick = (position: ClosedPosition) => {
    setSelectedPosition(position);
    setIsShareModalOpen(true);
  };

  return (
    <>
      <table className="min-w-full divide-y divide-cardborder">
        <thead>
          <tr className="bg-dark-1">
            <th className="px-7 py-4 text-left text-xs font-medium text-base-gray tracking-wider">
              Position / Side
            </th>
            <th className="px-7 py-4 text-left text-xs font-medium text-base-gray tracking-wider">
              Size / Leverage
            </th>
            <th className="px-7 py-4 text-left text-xs font-medium text-base-gray tracking-wider">
              Entry Price / Time
            </th>
            <th className="px-7 py-4 text-left text-xs font-medium text-base-gray tracking-wider">
              Exit Price / Status
            </th>
            <th className="px-7 py-4 text-left text-xs font-medium text-base-gray tracking-wider">
              Profit / Loss
            </th>
            <th className="px-7 py-4 text-left text-xs font-medium text-base-gray tracking-wider">
              Share Position
            </th>
          </tr>
        </thead>
        <tbody className="border-b border-cardborder bg-card-grad text-white text-sm">
          {sortedPositions.map((position, index) => {
            const priceDecimals = getPriceDecimals(position.exitPrice);
            const pnlPercentage =
              (position.realizedPnl / position.collateral) * 100;

            return (
              <tr
                key={index}
                className="border-y-cardborder border-y-1 bg-card-grad cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>{`${position.symbol.split(":")[0]}/USD`}</span>
                    <span
                      className={`
                    ${
                      position.isLong
                        ? "text-printer-green"
                        : "text-printer-red"
                    }
                  `}
                    >
                      {position.isLong ? "LONG" : "SHORT"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>{`${position.size.toFixed(2)} USD`}</span>
                    <span className="text-printer-green">
                      {`${getLeverage(position)}x`}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>{`$${
                      typeof position.entryPrice === "number"
                        ? position.entryPrice.toFixed(priceDecimals)
                        : position.entryPrice
                    }`}</span>
                    <span className="text-base-gray">{position.entryTime}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span>{`$${position.exitPrice.toFixed(
                      priceDecimals
                    )}`}</span>
                    <span className="text-base-gray">
                      {position.exitStatus}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`flex flex-col ${
                      position.realizedPnl >= 0
                        ? "text-printer-green"
                        : "text-printer-red"
                    }`}
                  >
                    <span>
                      {position.exitStatus === "Liquidated"
                        ? `-$${position.collateral.toFixed(2)}`
                        : `${position.realizedPnl >= 0 ? "$" : "-$"}${Math.abs(
                            position.realizedPnl
                          ).toFixed(2)}`}
                    </span>
                    <span>{`${
                      position.exitStatus === "Liquidated"
                        ? "-100.00"
                        : pnlPercentage.toFixed(2)
                    }%`}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <FaShareSquare
                    className="text-printer-orange text-2xl hover:text-printer-dark-orange cursor-pointer"
                    onClick={() => handleShareClick(position)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ModalV2
        isOpen={isShareModalOpen}
        setIsModalOpen={setIsShareModalOpen}
        size="xl"
      >
        {selectedPosition && (
          <TradeShare
            position={`${selectedPosition.symbol.split(":")[0]}/USD`}
            pnlPercentage={
              selectedPosition.exitStatus === "Liquidated"
                ? -100.0
                : parseFloat(
                    (
                      (selectedPosition.realizedPnl /
                        selectedPosition.collateral) *
                      100
                    ).toFixed(2)
                  )
            }
            entryPrice={selectedPosition.entryPrice}
            currentPrice={selectedPosition.exitPrice}
            assetLogo={getImageUrlfromTokenSymbol(
              selectedPosition.symbol.split(":")[0]
            )}
            isLong={selectedPosition.isLong}
            leverage={parseFloat(getLeverage(selectedPosition))}
            onClose={() => setIsShareModalOpen(false)}
            isClosed={true}
          />
        )}
      </ModalV2>
    </>
  );
};

export default ClosedPositionsTable;
