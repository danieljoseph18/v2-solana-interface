const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const createMarketOrder = async (orderRequest: OrderRequest) => {
  console.log("Backend Url ", BACKEND_URL);
  try {
    const response = await fetch(`${BACKEND_URL}/trade`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderRequest),
    });

    console.log("response", response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create order");
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
    console.error("[Market Order Error]:", error);
    return { success: false, error: error.message || "Failed to create order" };
  }
};
