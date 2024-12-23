"use server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export async function createMarketOrder(orderRequest: OrderRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/trade`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create order");
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}
