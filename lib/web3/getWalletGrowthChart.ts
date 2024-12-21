export const getWalletGrowthChart = async (
  smartAccountAddress: `0x${string}`,
  days: number | undefined,
  chainId: number
): Promise<
  {
    timestamp: number;
    value: number;
  }[]
> => {
  // Default to 30 days if days not provided
  const numDays = days || 30;

  // Generate random data points for the past numDays
  const data: { timestamp: number; value: number }[] = [];
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;

  // Start with a base value between 1000-5000
  let currentValue = 1000 + Math.random() * 4000;

  for (let i = numDays - 1; i >= 0; i--) {
    // Add some random variation each day (-5% to +5%)
    const change = currentValue * (Math.random() * 0.1 - 0.05);
    currentValue += change;

    data.push({
      timestamp: now - i * dayInMs,
      value: Math.max(0, currentValue), // Ensure value doesn't go negative
    });
  }

  return data;
};
