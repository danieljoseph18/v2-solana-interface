import { Connection, PublicKey } from "@solana/web3.js";
import { getMint } from "@solana/spl-token";
import { contractAddresses, getCurrentNetwork } from "../config";

export const getLpTokenSupply = async (
  connection: Connection
): Promise<number> => {
  const network = getCurrentNetwork();

  try {
    const lpTokenMint = new PublicKey(contractAddresses[network].lpTokenMint);

    // Get the mint info
    const mintInfo = await getMint(connection, lpTokenMint);

    // Convert to human-readable format (assuming 6 decimals)
    const formattedSupply = Number(mintInfo.supply) / 1_000_000;

    return formattedSupply;
  } catch (error) {
    console.error("Error fetching LP token total supply:", error);
    throw error;
  }
};
