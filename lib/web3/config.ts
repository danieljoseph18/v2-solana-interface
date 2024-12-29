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
    solVault: "39Nog6QGX5mFhJCdmar3qS8v9aAVGBctrUXhkgDMSrit",
    usdcVault: "A8hDMM1GwhTa3ut1odRU5xGdAx4F7goZsP4dSnnyiik2",
    lpTokenMint: "3HY9RDdMRHysagQd2aF1tmD5Lb3pV5LxbuiAoSHSDmt8",
    chainlinkProgram: "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny",
    chainlinkFeed: "HgTtcbcmp5BeThax5AU8vg4VwK79qAvAKKFMs8txMLW6",
    tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    systemProgram: "11111111111111111111111111111111",
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
