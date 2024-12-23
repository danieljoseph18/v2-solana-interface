import React, { useMemo, useState } from "react";
import { FaStar, FaSort } from "react-icons/fa";
import { getPriceDecimals } from "@/lib/web3/formatters";
import { formatLiquidity } from "@/lib/web3/formatters";
import { getImageForToken } from "@/lib/utils/getTokenImage";

interface AssetTableProps {
  tokens: Asset[];
  onAssetClick: (asset: Asset) => void;
  toggleFavorite: (marketId: string) => void;
  isFavorite: (marketId: string) => boolean;
}

const AssetTable: React.FC<AssetTableProps> = ({
  tokens,
  onAssetClick,
  toggleFavorite,
  isFavorite,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Asset;
    direction: "ascending" | "descending";
  } | null>(null);

  const sortedData = useMemo(() => {
    let sortableData = [...tokens];
    if (sortConfig !== null) {
      sortableData.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [tokens, sortConfig]);

  const requestSort = (key: keyof Asset) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <div className="custom-scrollbar max-h-[300px] overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-transparent rounded-lg">
            <thead>
              <tr className="bg-transparent">
                <th
                  className="py-1 text-xs font-medium text-base-gray cursor-pointer"
                  onClick={() => requestSort("symbol")}
                >
                  <div className="flex flex-row gap-0.5 justify-start items-center">
                    <span>Market</span>
                    <FaSort />
                  </div>
                </th>
                <th
                  className=" py-1 text-center text-xs font-medium text-base-gray cursor-pointer"
                  onClick={() => requestSort("maxLeverage")}
                >
                  <div className="flex flex-row gap-0.5 justify-center items-center">
                    <span>Lev</span>
                    <FaSort />
                  </div>
                </th>
                <th
                  className=" py-1 text-right text-xs font-medium text-base-gray cursor-pointer"
                  onClick={() => requestSort("lastPrice")}
                >
                  <div className="flex flex-row gap-0.5 justify-end items-center">
                    <span>Price</span>
                    <FaSort />
                  </div>
                </th>
                <th
                  className=" py-1 text-xs text-right font-medium text-base-gray cursor-pointer"
                  onClick={() => requestSort("fundingRate")}
                >
                  <div className="flex flex-row gap-0.5 justify-end items-center">
                    <span>Funding Rate</span>
                    <FaSort />
                  </div>
                </th>
                <th
                  className=" py-1 text-xs text-right font-medium text-base-gray cursor-pointer"
                  onClick={() => requestSort("volume24h")}
                >
                  <div className="flex flex-row gap-0.5 justify-end items-center">
                    <span>24H Vol</span>
                    <FaSort />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((asset) => {
                const priceDecimals = asset.lastPrice
                  ? getPriceDecimals(asset.lastPrice)
                  : 7;
                return (
                  <tr
                    key={asset.id}
                    className="bg-transparent cursor-pointer hover:opacity-80"
                    onClick={() => onAssetClick(asset)}
                  >
                    <td className="py-1.5 whitespace-nowrap text-sm font-medium text-white">
                      <div className="flex flex-row gap-2 items-center">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleFavorite(asset.id);
                          }}
                        >
                          {isFavorite(asset.id) ? (
                            <FaStar className="text-printer-orange text-2xl" />
                          ) : (
                            <FaStar className="text-[#71757A] text-2xl" />
                          )}
                        </button>
                        <img
                          src={getImageForToken(asset)}
                          alt={`${asset.symbol} logo`}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="text-base text-printer-gray font-bold">
                          {asset.symbol}
                        </span>
                      </div>
                    </td>
                    <td className="py-1.5 whitespace-nowrap text-center text-dark-text font-bold">
                      <div className="border-cardborder border-2 text-xxs rounded bg-green-grad">
                        {asset.maxLeverage}X
                      </div>
                    </td>
                    <td className="py-1.5 whitespace-nowrap text-sm text-right text-printer-gray">
                      {asset.lastPrice
                        ? asset.lastPrice!.toFixed(priceDecimals)
                        : "N/A"}
                    </td>
                    <td
                      className={`py-1.5 whitespace-nowrap text-sm text-right ${
                        asset.fundingRate! > 0
                          ? "text-printer-green"
                          : "text-printer-red"
                      }`}
                    >
                      {asset.fundingRate!.toFixed(2)}%
                    </td>
                    <td className="py-1.5 whitespace-nowrap text-sm text-right text-printer-gray">
                      {formatLiquidity(asset.volume24h || 0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssetTable;
