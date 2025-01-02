export type NetworkType = "devnet" | "mainnet";

interface NetworkConfig {
  rpcUrl: string;
  adminWallet: string;
}

interface Web3Config {
  defaultNetwork: NetworkType;
  networks: {
    [key in NetworkType]: NetworkConfig;
  };
}

export const web3Config: Web3Config = {
  defaultNetwork: (process.env.NEXT_PUBLIC_SOLANA_NETWORK ||
    "devnet") as NetworkType,

  networks: {
    devnet: {
      rpcUrl: "https://api.devnet.solana.com",
      adminWallet: "2WopEVinpz5MrjJcQppuvE2C5m14iPE5XNR8a2wsCs4C",
    },

    mainnet: {
      rpcUrl: "https://api.mainnet-beta.solana.com",
      adminWallet: "2WopEVinpz5MrjJcQppuvE2C5m14iPE5XNR8a2wsCs4C",
    },
  },
};

export const contractAddresses = {
  devnet: {
    programId: "3JhuFvHHTxCGeJviVMv4SYUWQ1qAb9tFNy7ZU8dxBhpq",
    poolStatePda: "9bB1TCESgoTRUNFT7xfz5myL5XG7n3upBtvx7cGypnwo",
    solMint: "So11111111111111111111111111111111111111112",
    usdcMint: "7ggkvgP7jijLpQBV5GXcqugTMrc2JqDi9tiCH36SVg7A",
    solVault: "ESecGS3Hg7uGw8SpKszWa2ra14asp4N8UD47iZNXhMc3",
    usdcVault: "FVjaqKgaAKM2H85MDjKujeYF9XR2em8GhSFYv5FntfgK",
    lpTokenMint: "Cm15ZRE46tDAbB3gQfB7beyABbsfG1VQn1gj4z9nb1sv",
    chainlinkProgram: "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny",
    chainlinkFeed: "99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR",
    tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    systemProgram: "11111111111111111111111111111111",
  },
  mainnet: {
    programId: "3JhuFvHHTxCGeJviVMv4SYUWQ1qAb9tFNy7ZU8dxBhpq",
    poolStatePda: "9bB1TCESgoTRUNFT7xfz5myL5XG7n3upBtvx7cGypnwo",
    solMint: "So11111111111111111111111111111111111111112", // Mainnet SOL
    usdcMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Mainnet USDC
    solVault: "ESecGS3Hg7uGw8SpKszWa2ra14asp4N8UD47iZNXhMc3",
    usdcVault: "FVjaqKgaAKM2H85MDjKujeYF9XR2em8GhSFYv5FntfgK",
    lpTokenMint: "Cm15ZRE46tDAbB3gQfB7beyABbsfG1VQn1gj4z9nb1sv",
    chainlinkProgram: "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny",
    chainlinkFeed: "CH31Xns5z3M1cTAbKW34jcxPPciazARpijcHj9rxtemt",
    tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    systemProgram: "11111111111111111111111111111111",
  },
};

// Helper functions

export function getNetworkConfig(): NetworkConfig {
  return web3Config.networks[getCurrentNetwork()];
}

export const getCurrentNetwork = (): NetworkType => {
  const isDevnet = process.env.NEXT_PUBLIC_IS_DEVNET;
  return isDevnet ? "devnet" : "mainnet";
};

export function getRpcUrl(): string {
  return getNetworkConfig().rpcUrl;
}

export function getTokenMint(token: "USDC" | "SOL"): string {
  const network = getCurrentNetwork();

  return token === "USDC"
    ? contractAddresses[network].usdcMint
    : contractAddresses[network].solMint;
}

export function getAdminWallet(): string {
  return getNetworkConfig().adminWallet;
}
