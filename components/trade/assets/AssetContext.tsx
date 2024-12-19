import React, { createContext, useContext } from "react";

interface AssetContextProps {
  asset: Asset | null;
  setAsset: (asset: Asset) => void;
  allAssets: Asset[];
  setAllAssets: (assets: Asset[]) => void;
}

const AssetContext = createContext<AssetContextProps | undefined>(undefined);

export const AssetProvider: React.FC<
  AssetContextProps & { children: React.ReactNode }
> = ({ asset, setAsset, allAssets, setAllAssets, children }) => {
  return (
    <AssetContext.Provider
      value={{
        asset,
        setAsset,
        allAssets,
        setAllAssets,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};

export const useAsset = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error("useAsset must be used within an AssetProvider");
  }
  return context;
};
