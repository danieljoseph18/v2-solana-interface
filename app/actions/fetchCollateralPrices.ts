export const fetchCollateralPrices = async (): Promise<{
  solPrice: number;
  usdcPrice: number;
}> => {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  const fetchSolPrice = fetch(`${BACKEND_URL}/price/sol`).then((res) => {
    return res.json();
  });

  const fetchUsdcPrice = fetch(`${BACKEND_URL}/price/usdc`).then((res) => {
    return res.json();
  });

  const [solPrice, usdcPrice] = await Promise.all([
    fetchSolPrice,
    fetchUsdcPrice,
  ]);

  return { solPrice, usdcPrice };
};
