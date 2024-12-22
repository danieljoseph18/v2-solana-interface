type TokenType = "SOL" | "USDC";

interface MarginBalance {
  amount: string;
  token: TokenType;
}

interface DepositResponse {
  success: boolean;
  balance: MarginBalance;
}

interface WithdrawResponse {
  success: boolean;
  withdrawalId: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
}
