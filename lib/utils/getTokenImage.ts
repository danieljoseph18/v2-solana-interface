export const getImageForToken = (asset: Asset): string => {
  return getImageUrlFromTokenSymbol(asset.symbol);
};

export const getImageUrlFromTokenSymbol = (tokenSymbol: string): string => {
  const uppercaseTokenSymbol = tokenSymbol.toUpperCase();
  const imageUrl = tokenImages.get(uppercaseTokenSymbol);

  if (imageUrl) {
    return imageUrl;
  } else {
    return "/img/common/missing-logo.png";
  }
};

const tokenImages: Map<string, string> = new Map([
  ["TOPKEK", "https://assets.geckoterminal.com/g2byo3jwz0a0tdb29jzjbic5ir54"],
  [
    "AI16Z",
    "https://coin-images.coingecko.com/coins/images/51090/large/AI16Z.jpg?1730027175",
  ],
  [
    "DRUGS",
    "https://coin-images.coingecko.com/coins/images/52800/large/drugs.jpg?1734335862",
  ],
  ["HAIYEZ", "https://assets.geckoterminal.com/dyvufbl70mt6uzdy04asnio1cx5t"],
  ["SOL", "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png"],
  ["USDC", "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"],
  ["BTC", "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"],
  ["ETH", "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"],
  ["WETH", "https://s2.coinmarketcap.com/static/img/coins/64x64/2396.png"],
  ["USDT", "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png"],
]);
