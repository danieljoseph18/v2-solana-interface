// config/web3.ts

export type NetworkType = "devnet" | "mainnet";

interface NetworkConfig {
  rpcUrl: string;
  tokenMints: {
    USDC: string;
    SOL: string;
  };
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
      tokenMints: {
        USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Devnet USDC
        SOL: "So11111111111111111111111111111111111111112", // Devnet SOL
      },
      adminWallet: "2WopEVinpz5MrjJcQppuvE2C5m14iPE5XNR8a2wsCs4C",
    },

    mainnet: {
      rpcUrl: "https://api.mainnet-beta.solana.com",
      tokenMints: {
        USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Mainnet USDC
        SOL: "So11111111111111111111111111111111111111112", // Mainnet SOL
      },
      adminWallet: "2WopEVinpz5MrjJcQppuvE2C5m14iPE5XNR8a2wsCs4C",
    },
  },
};

// Helper functions
export function getCurrentNetwork(): NetworkType {
  const isDevnet = process.env.NODE_ENV === "development";
  return isDevnet ? "devnet" : "mainnet";
}

export function getNetworkConfig(): NetworkConfig {
  return web3Config.networks[getCurrentNetwork()];
}

export function getRpcUrl(): string {
  return getNetworkConfig().rpcUrl;
}

export function getTokenMint(token: "USDC" | "SOL"): string {
  return getNetworkConfig().tokenMints[token];
}

export function getAdminWallet(): string {
  return getNetworkConfig().adminWallet;
}
