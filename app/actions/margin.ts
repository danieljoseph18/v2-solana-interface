"use server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

export const depositMargin = async (
  publicKey: string,
  amount: string,
  token: TokenType,
  txHash: string
) => {
  const response = await fetch(`${BACKEND_URL}/margin/deposit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicKey, amount, token, txHash }),
  });

  if (!response.ok) {
    throw new Error("Failed to process deposit");
  }

  return response.json();
};

export const requestWithdrawal = async (
  publicKey: string,
  amount: string,
  token: TokenType
) => {
  const response = await fetch(`${BACKEND_URL}/margin/withdraw`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ publicKey, amount, token }),
  });

  if (!response.ok) {
    throw new Error("Failed to process withdrawal");
  }

  return response.json();
};

export const getBalance = async (publicKey: string, token: TokenType) => {
  const response = await fetch(
    `${BACKEND_URL}/margin/balance/${token}?publicKey=${publicKey}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch balance");
  }

  return response.json();
};
