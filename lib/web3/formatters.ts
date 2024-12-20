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

export const nFormatter = (
  number: number | null | undefined | string,
  decimals: number = 2,
  symbol: string | null = null,
  thousands: boolean = false
) => {
  if (number === undefined || number === null) {
    return "...";
  }

  if (thousands) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "B" },
      { value: 1e12, symbol: "T" },
      //   { value: 1e15, symbol: "P" },
      //   { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return Math.abs(Number(number)) >= item.value;
      });

    if (!item) {
      // Handle the case where the input value is 0
      return Number("0").toFixed(decimals);
    }
    const formattedValue = item
      ? (Math.abs(Number(number)) / item.value)
          .toFixed(decimals)
          .replace(rx, "$1")
      : "0";

    return Number(number) < 0
      ? `-${formattedValue}${item?.symbol}`
      : `${formattedValue}${item?.symbol}`;
  }

  let n = new Intl.NumberFormat("en-UK", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(Math.abs(Number(number)));

  if (symbol) {
    if (Number(number) >= 0) {
      n = symbol.concat(n);
    } else {
      n = "-".concat(symbol.concat(n));
    }
  } else if (Number(number) < 0) {
    n = "-".concat(n);
  }
  return n;
};

export const getDirection = (
  number: number | null | undefined | string
): "up" | "none" | "down" => {
  let result: "up" | "none" | "down" = "none";
  if (number === undefined || number === null) {
    return result;
  }
  if (isNaN(Number(number))) {
    return result;
  }
  if (Number(number) > 0) {
    result = "up";
  } else if (Number(number) < 0) {
    result = "down";
  } else {
    result = "none";
  }

  return result;
};
