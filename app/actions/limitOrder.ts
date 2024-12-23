"use server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function createLimitOrder(orderRequest: LimitOrderRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/limit-orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create limit order");
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}
