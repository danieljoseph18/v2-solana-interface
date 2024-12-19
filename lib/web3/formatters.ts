/**
 * Helper function to format a UNIX timestamp as a full date and time.
 * @param timestamp - The UNIX timestamp in seconds.
 * @returns The formatted date and time string.
 */
export const formatUnixTimestamp = (timestamp: number): string => {
  // Create a Date object from the UNIX timestamp
  const date = new Date(timestamp * 1000);

  // Define options for the date formatting
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
    timeZoneName: "short",
  };

  // Format the date using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);

  // Remove the trailing "UTC" to match the desired output
  const formattedDateWithoutUTC = formattedDate.replace(", UTC", " UTC");

  return formattedDateWithoutUTC;
};

export const getPriceDecimals = (price: number): number => {
  if (price >= 1000) {
    return 2;
  }

  if (price >= 1) {
    return 4;
  }

  const priceStr = price.toString();
  const [, decimalPart] = priceStr.split(".");

  if (!decimalPart) {
    return 2;
  }

  let significantDigits = 0;
  let leadingZeros = 0;
  let foundNonZero = false;

  for (const char of decimalPart) {
    if (char === "0" && !foundNonZero) {
      leadingZeros++;
    } else {
      foundNonZero = true;
      significantDigits++;
      if (significantDigits === 4) break;
    }
  }

  // For very small numbers in scientific notation (e.g., 1.86218470239e-9)
  if (priceStr.includes("e-")) {
    const [base, exponent] = priceStr.split("e-");
    const exponentNum = parseInt(exponent, 10);
    return Math.max(2, exponentNum + 4);
  }

  return Math.max(2, leadingZeros + 4);
};

/**
 * Helper function to convert a float to a formatted string with commas as thousand separators.
 * @param value - The float value to be converted.
 * @returns The formatted string.
 */
export const formatFloatWithCommas = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Helper function to convert a timestamp to a formatted countdown string.
 * e.g 12345 -> 1d 5h 3m 10s
 */
export const formatDurationWithLocale = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const pad = (num: number) => num.toString().padStart(2, "0");

  return `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m ${pad(
    remainingSeconds
  )}s`;
};

// Abbreviates liquidity to a string with a dollar sign
export const formatLiquidity = (liquidity: number): string => {
  const abbreviations = ["", "K", "M", "B", "T"];
  const tier = (Math.log10(Math.abs(liquidity)) / 3) | 0;

  if (tier === 0) return `$${liquidity}`;

  const scale = Math.pow(10, tier * 3);
  const scaled = liquidity / scale;

  return `$${scaled.toFixed(2)}${abbreviations[tier]}`;
};

export const formatSmallNumber = (num: number): string => {
  return num.toFixed(20).replace(/\.?0+$/, "");
};
