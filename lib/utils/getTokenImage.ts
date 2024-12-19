import { cmcIds } from "./cmcIds";

export const getImageForToken = (asset: Asset): string => {
  if (asset.image !== "/img/common/missing-logo.png") {
    return asset.image;
  }

  const tokenSymbol = asset.symbol;

  const cmcIdArray = cmcIds.get(tokenSymbol);

  if (cmcIdArray && cmcIdArray.length > 0) {
    const cmcId = cmcIdArray[0];
    return `https://s2.coinmarketcap.com/static/img/coins/128x128/${cmcId}.png`;
  } else {
    return "/img/common/missing-logo.png";
  }
};

export const getImageUrlfromTokenSymbol = (tokenSymbol: string): string => {
  const cmcIdArray = cmcIds.get(tokenSymbol);

  if (cmcIdArray && cmcIdArray.length > 0) {
    const cmcId = cmcIdArray[0];
    return `https://s2.coinmarketcap.com/static/img/coins/128x128/${cmcId}.png`;
  } else {
    return "/img/common/missing-logo.png";
  }
};
