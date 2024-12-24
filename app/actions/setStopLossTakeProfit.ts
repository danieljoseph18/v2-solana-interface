const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const setStopLossTakeProfit = async (
  positionId: string,
  priceToExecute: number,
  publicKey: string,
  isStopLoss: boolean
) => {
  try {
    let response;
    if (isStopLoss) {
      response = await fetch(
        `${BACKEND_URL}/trade/position/${positionId}/stop-loss?publicKey=${publicKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ stopLossPrice: priceToExecute.toString() }),
        }
      );
    } else {
      response = await fetch(
        `${BACKEND_URL}/trade/position/${positionId}/take-profit?publicKey=${publicKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ takeProfitPrice: priceToExecute.toString() }),
        }
      );
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to close position");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const text = await response.text();
      return { success: true, data: text };
    }
  } catch (error: any) {
    console.error("[Stop Loss Take Profit Error]:", error);
    return {
      success: false,
      error: error.message || "Failed to set stop loss/take profit",
    };
  }
};
