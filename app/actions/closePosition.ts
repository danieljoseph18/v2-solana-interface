const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const closePosition = async (
  positionId: string,
  sizeDelta: number,
  publicKey: string
) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/trade/position/${positionId}/close?publicKey=${publicKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sizeDelta: sizeDelta.toString() }),
      }
    );

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
    console.error("[Close Position Error]:", error);
    return {
      success: false,
      error: error.message || "Failed to close position",
    };
  }
};
