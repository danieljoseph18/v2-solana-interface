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
        USDC: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU", // Devnet USDC
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

export const contractAddresses = {
  devnet: {
    programId: "3JhuFvHHTxCGeJviVMv4SYUWQ1qAb9tFNy7ZU8dxBhpq",
    poolStatePda: "9bB1TCESgoTRUNFT7xfz5myL5XG7n3upBtvx7cGypnwo",
    solMint: "So11111111111111111111111111111111111111112",
    usdcMint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    solVault: "ESecGS3Hg7uGw8SpKszWa2ra14asp4N8UD47iZNXhMc3",
    usdcVault: "BdavWxBcpGDFb7YnpB7uP2mBzrs1cQoE2R7cLdSMeyFS",
    lpTokenMint: "GiTXHPAPwYaKjwAaBbhGKmmnWD3k7BFC56hnG5sHYjZs",
    chainlinkProgram: "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny",
    chainlinkFeed: "99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR",
    tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    systemProgram: "11111111111111111111111111111111",
  },
  mainnet: {
    chainlinkProgram: "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny",
    chainlinkFeed: "CH31Xns5z3M1cTAbKW34jcxPPciazARpijcHj9rxtemt",
    solMint: "So11111111111111111111111111111111111111112", // Mainnet SOL
    usdcMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Mainnet USDC
  },
};

// Helper functions
export function getCurrentNetwork(): NetworkType {
  const isDevnet = process.env.NEXT_PUBLIC_IS_DEVNET;
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
