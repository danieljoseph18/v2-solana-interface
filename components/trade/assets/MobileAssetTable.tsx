import React, { useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import { getPriceDecimals, formatLiquidity } from "@/lib/web3/formatters";
import { getImageForToken } from "@/lib/utils/getTokenImage";

interface MobileAssetTableProps {
  tokens: Asset[];
  onAssetClick: (asset: Asset) => void;
  toggleFavorite: (marketId: string) => void;
  isFavorite: (marketId: string) => boolean;
}

const MobileAssetTable: React.FC<MobileAssetTableProps> = ({
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

  return (
    <div>
      <div className="custom-scrollbar overflow-y-auto pb-24">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-transparent rounded-lg">
            <tbody>
              {sortedData.map((asset) => {
                const priceDecimals = asset.price
                  ? getPriceDecimals(asset.price)
                  : 7;
                return (
                  <tr
                    key={asset.marketId}
                    className="bg-transparent cursor-pointer hover:opacity-80"
                    onClick={() => onAssetClick(asset)}
                  >
                    <td className="py-1.5 whitespace-nowrap text-sm font-medium text-white">
                      <div className="flex flex-row gap-2 items-center">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleFavorite(asset.marketId);
                          }}
                        >
                          {isFavorite(asset.marketId) ? (
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
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-printer-gray font-bold">
                            {asset.symbol}
                          </span>
                          <span className="text-xs text-printer-gray font-medium">
                            {`Liq - ${formatLiquidity(asset.liquidity)}`}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-1.5 whitespace-nowrap text-center text-dark-text font-bold">
                      <div className="border-cardborder border-2 text-xxs rounded bg-green-grad max-w-[50px]">
                        {asset.leverage}X
                      </div>
                    </td>
                    <td className="whitespace-nowrap text-sm text-right text-printer-gray">
                      <div className="flex flex-col gap-1">
                        <p>{asset.price!.toFixed(priceDecimals)}</p>
                        <p
                          className={`whitespace-nowrap text-sm text-right ${
                            asset.change! > 0
                              ? "text-printer-green"
                              : "text-printer-red"
                          }`}
                        >
                          {`${
                            asset.change! > 0 ? "+" : ""
                          }${asset.change!.toFixed(2)}%`}
                        </p>
                      </div>
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

export default MobileAssetTable;
