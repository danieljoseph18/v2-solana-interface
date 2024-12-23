import React, { useState, useCallback } from "react";
import SearchInput from "@/components/common/SearchInput";
import HorizontalDivider from "./HorizontalDivider";
import AssetTable from "./AssetTable";
import { useAsset } from "./AssetContext";
import ModalClose from "@/components/common/ModalClose";
import ModalV2 from "@/components/common/ModalV2";
import Image from "next/image";
import NoAssetsFound from "@/app/assets/common/no-assets-found.svg";
import MobileAssetTable from "./MobileAssetTable";
import useWindowSize from "@/hooks/useWindowSize";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type AssetSelectPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AssetSelectPopup: React.FC<AssetSelectPopupProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { allAssets, setAsset } = useAsset();
  const [favorites, setFavorites] = useLocalStorage<string[]>("favorites", []);

  const { width } = useWindowSize();

  const isDesktop = width && width >= 1024;

  const toggleFavorite = useCallback(
    (marketId: string) => {
      let newFavorites: string[] = [];
      if (favorites.includes(marketId)) {
        newFavorites = favorites.filter((id) => id !== marketId);
      } else {
        newFavorites = [...favorites, marketId];
      }
      setFavorites(newFavorites);
    },
    [setFavorites, favorites]
  );

  const isFavorite = useCallback(
    (marketId: string) => favorites && favorites.includes(marketId),
    [favorites]
  );

  const filteredTokens = allAssets.filter((token) =>
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssetClick = (asset: Asset) => {
    setAsset(asset);
    onClose();
  };

  return (
    <ModalV2 isOpen={isOpen} setIsModalOpen={() => onClose()} size="xl">
      <div className="flex flex-col h-screen w-screen fixed inset-0 z-50 bg-card-grad lg:static lg:h-full lg:w-full">
        <div className="w-full px-2 sm:px-4 pt-4 pb-2">
          <div className="relative mb-2 flex flex-row gap-2">
            <SearchInput
              placeholder="Search Token..."
              searchName="searchValue"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ModalClose onClose={onClose} />
          </div>
        </div>
        <HorizontalDivider dividerColour="cardborder" />
        <div className="flex flex-col gap-2 w-full p-2 sm:px-6 sm:pb-6 sm:pt-2 flex-grow overflow-auto">
          {filteredTokens.length > 0 ? (
            <>
              <span className="text-white text-sm mb-4">Perpetual Futures</span>
              {isDesktop ? (
                <AssetTable
                  tokens={filteredTokens}
                  onAssetClick={handleAssetClick}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                />
              ) : (
                <MobileAssetTable
                  tokens={filteredTokens}
                  onAssetClick={handleAssetClick}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                />
              )}
            </>
          ) : (
            <div className="flex flex-col w-full h-full items-center justify-center gap-4 py-6">
              <Image
                src={NoAssetsFound}
                alt="No assets found"
                width={132}
                height={132}
              />
              <span className="text-base-gray text-[14px] font-semibold">
                No Assets Found
              </span>
            </div>
          )}
        </div>
      </div>
    </ModalV2>
  );
};

export default AssetSelectPopup;
