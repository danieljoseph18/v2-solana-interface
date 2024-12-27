// import { Connection, PublicKey } from "@solana/web3.js";
// import * as anchor from "@coral-xyz/anchor";
// import { Program } from "@coral-xyz/anchor";
// import { idl } from "@/lib/web3/idl/solana_liquidity_pool";
// import { SolanaLiquidityPool } from "@/lib/web3/idl/solana_liquidity_pool.types";

// const connection = new Connection("https://api.devnet.solana.com");
// const provider = new anchor.AnchorProvider(connection, window.solana, {
//   commitment: "confirmed",
// });
// const programId = new PublicKey("CkpZTxULEPgWHKkmWcNdvBR4SkijmUMY3sRYurGeTTvF");

// export const program = new Program(idl as SolanaLiquidityPool, provider);

// export const getUserBalances = async (poolAddress: PublicKey) => {
//   try {
//     const poolAccount = await program.account.poolState.fetch(poolAddress);

//     return {
//       solBalance: poolAccount.solDeposited.toString(),
//       usdcBalance: poolAccount.usdcDeposited.toString(),
//       solFormatted: (
//         parseInt(poolAccount.solDeposited.toString()) / 1e9
//       ).toFixed(9),
//       usdcFormatted: (
//         parseInt(poolAccount.usdcDeposited.toString()) / 1e6
//       ).toFixed(6),
//     };
//   } catch (error) {
//     console.error("Error fetching user balances:", error);
//     throw error;
//   }
// };

// export const getCurrentRewardRate = async (poolAddress: PublicKey) => {
//   try {
//     const poolAccount = await program.account.poolState.fetch(poolAddress);
//     const tokensPerInterval = poolAccount.tokensPerInterval;

//     return {
//       rewardRate: tokensPerInterval.toString(),
//       rewardRateFormatted: (
//         parseInt(tokensPerInterval.toString()) / 1e6
//       ).toFixed(6),
//       rewardsDuration: (
//         poolAccount.rewardEndTime.toNumber() -
//         poolAccount.rewardStartTime.toNumber()
//       ).toString(),
//       isRewardsActive:
//         poolAccount.rewardEndTime.toNumber() > Math.floor(Date.now() / 1000),
//     };
//   } catch (error) {
//     console.error("Error fetching reward rate:", error);
//     throw error;
//   }
// };

// export const getPendingRewards = async (
//   poolAddress: PublicKey,
//   userAddress: PublicKey
// ) => {
//   try {
//     const poolAccount = await program.account.poolState.fetch(poolAddress);
//     const [userStateAccount] = PublicKey.findProgramAddressSync(
//       [Buffer.from("user"), poolAddress.toBuffer(), userAddress.toBuffer()],
//       program.programId
//     );

//     const userAccount = await program.account.userState.fetch(userStateAccount);
//     const currentTime = Math.floor(Date.now() / 1000);

//     const timeElapsed = currentTime - userAccount.lastClaimTimestamp.toNumber();

//     const pendingRewards = new anchor.BN(timeElapsed)
//       .mul(poolAccount.tokensPerInterval)
//       .mul(userAccount.lpTokenBalance);

//     return {
//       pendingRewards: pendingRewards.toString(),
//       pendingRewardsFormatted: (
//         parseInt(pendingRewards.toString()) / 1e6
//       ).toFixed(6),
//       lastUpdateTime: userAccount.lastClaimTimestamp.toString(),
//       rewardEndTime: poolAccount.rewardEndTime.toString(),
//     };
//   } catch (error) {
//     console.error("Error calculating pending rewards:", error);
//     throw error;
//   }
// };
