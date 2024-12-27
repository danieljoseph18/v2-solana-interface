import { useState, useEffect } from "react";
import HorizontalDivider from "../common/HorizontalDivider";
import EntryCard from "./EntryCard";
import ModalV2 from "../common/ModalV2";
import { TabType, CollateralType } from "@/types/earn";
import LoadingSpinner from "../common/LoadingSpinner";
import { useWallet } from "@/hooks/useWallet";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
import { idl } from "@/lib/web3/idl/solana_liquidity_pool";
import { SolanaLiquidityPool } from "@/lib/web3/idl/solana_liquidity_pool.types";
import { Program } from "@coral-xyz/anchor";
import { contractAddresses } from "@/lib/web3/config";
import * as anchor from "@coral-xyz/anchor";

interface StatItemProps {
  iconSrc: string;
  label: string;
  value: string;
  subValue?: string;
  altText: string;
}

const StatItem = ({
  iconSrc,
  label,
  value,
  subValue,
  altText,
}: StatItemProps) => (
  <>
    <div className="flex items-center gap-4 px-4 py-2">
      <img src={iconSrc} alt={altText} />
      <div className="flex flex-col gap-2">
        <p className="text-xs text-gray-text">{label}</p>
        <p className="text-white text-base font-bold">
          {value}
          {subValue && (
            <span className="text-xs text-gray-text font-medium">
              {subValue}
            </span>
          )}
        </p>
      </div>
    </div>
    <HorizontalDivider />
  </>
);

const EarnSection = () => {
  const { address: publicKey } = useWallet();

  const [activeTab, setActiveTab] = useState<TabType>("deposit");
  const [collateralType, setCollateralType] = useState<CollateralType>("SOL");
  const [amount, setAmount] = useState<string>("0");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPoolInitialized, setIsPoolInitialized] = useState<boolean>(false);
  const [vaultData, setVaultData] = useState<{
    deposits: string;
    apr: string;
    estimatedEarnings: string;
  }>({
    deposits: "0",
    apr: "0",
    estimatedEarnings: "0",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const isDeposit = activeTab === "deposit";

  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  const program = new Program(idl as SolanaLiquidityPool, {
    connection,
  });

  useEffect(() => {
    const checkPool = async () => {
      const poolAddress = new PublicKey(contractAddresses.devnet.poolStatePda);

      if (!poolAddress) return;

      try {
        const account = await connection.getAccountInfo(poolAddress);
        setIsPoolInitialized(account !== null);

        if (!account) {
          console.log(
            "Pool not initialized yet at address:",
            poolAddress.toString()
          );
        }
      } catch (error) {
        console.error("Error checking pool:", error);
      }
    };

    checkPool();
  }, [connection]);

  const getUserBalances = async (poolAddress: PublicKey) => {
    if (!isPoolInitialized || !publicKey) {
      return {
        solBalance: "0",
        usdcBalance: "0",
        solFormatted: "0",
        usdcFormatted: "0",
      };
    }

    try {
      const [userStateAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("user-state"),
          poolAddress.toBuffer(),
          new PublicKey(publicKey).toBuffer(),
        ],
        program.programId
      );

      const userState = await program.account.userState.fetch(userStateAccount);
      const poolState = await program.account.poolState.fetch(poolAddress);

      // Calculate user's share of the pool based on LP tokens
      const totalLpSupply = await program.account.poolState.fetch(poolAddress);
      const userShare =
        userState.lpTokenBalance.toNumber() /
        totalLpSupply.solDeposited.toNumber();

      const solBalance = (
        poolState.solDeposited.toNumber() * userShare
      ).toString();
      const usdcBalance = (
        poolState.usdcDeposited.toNumber() * userShare
      ).toString();

      return {
        solBalance,
        usdcBalance,
        solFormatted: (parseInt(solBalance) / 1e9).toFixed(9),
        usdcFormatted: (parseInt(usdcBalance) / 1e6).toFixed(6),
      };
    } catch (error) {
      console.error("Error fetching user balances:", error);
      throw error;
    }
  };

  const getCurrentRewardRate = async (poolAddress: PublicKey) => {
    if (!isPoolInitialized) {
      return {
        rewardRate: "0",
        rewardRateFormatted: "0",
        rewardsDuration: "0",
        isRewardsActive: false,
      };
    }

    try {
      const poolState = await program.account.poolState.fetch(poolAddress);
      const currentTime = Math.floor(Date.now() / 1000);

      return {
        rewardRate: poolState.tokensPerInterval.toString(),
        rewardRateFormatted: (
          parseInt(poolState.tokensPerInterval.toString()) / 1e6
        ).toFixed(6),
        rewardsDuration: (
          poolState.rewardEndTime.toNumber() -
          poolState.rewardStartTime.toNumber()
        ).toString(),
        isRewardsActive: poolState.rewardEndTime.toNumber() > currentTime,
      };
    } catch (error) {
      console.error("Error fetching reward rate:", error);
      throw error;
    }
  };

  const getPendingRewards = async (
    poolAddress: PublicKey,
    userAddress: PublicKey
  ) => {
    if (!isPoolInitialized) {
      return {
        pendingRewards: "0",
        pendingRewardsFormatted: "0",
        lastUpdateTime: "0",
        rewardEndTime: "0",
      };
    }

    try {
      const poolState = await program.account.poolState.fetch(poolAddress);
      const [userStateAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("user-state"),
          poolAddress.toBuffer(),
          userAddress.toBuffer(),
        ],
        program.programId
      );

      const userState = await program.account.userState.fetch(userStateAccount);
      const currentTime = Math.floor(Date.now() / 1000);
      const endTime = Math.min(currentTime, poolState.rewardEndTime.toNumber());

      // Calculate pending rewards
      const timeElapsed = endTime - userState.lastClaimTimestamp.toNumber();
      const rewardsPerToken =
        poolState.tokensPerInterval.toNumber() * timeElapsed;
      const userRewards =
        (userState.lpTokenBalance.toNumber() * rewardsPerToken) / 1e6;
      const totalPendingRewards =
        userState.pendingRewards.toNumber() + userRewards;

      return {
        pendingRewards: totalPendingRewards.toString(),
        pendingRewardsFormatted: (totalPendingRewards / 1e6).toFixed(6),
        lastUpdateTime: userState.lastClaimTimestamp.toString(),
        rewardEndTime: poolState.rewardEndTime.toString(),
      };
    } catch (error) {
      console.error("Error calculating pending rewards:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchVaultData = async () => {
      const poolAddress = new PublicKey(contractAddresses.devnet.poolStatePda);

      if (!publicKey) return;

      try {
        setLoading(true);

        if (!isPoolInitialized) {
          setVaultData({
            deposits: "0",
            apr: "0",
            estimatedEarnings: "0",
          });
          setLoading(false);
          return;
        }

        const [balances, rewardRate, pendingRewards] = await Promise.all([
          getUserBalances(poolAddress),
          getCurrentRewardRate(poolAddress),
          getPendingRewards(poolAddress, new PublicKey(publicKey)),
        ]);

        // Calculate total deposits in USD
        const poolState = await program.account.poolState.fetch(poolAddress);
        const solPrice = poolState.solUsdPrice.toNumber() / 1e8; // Chainlink price has 8 decimals
        const solValueInUSD = parseFloat(balances.solFormatted) * solPrice;
        const usdcValue = parseFloat(balances.usdcFormatted);
        const totalDepositsUSD = solValueInUSD + usdcValue;

        // Calculate APR (reward rate per second to APR)
        const rewardRatePerSecond = parseFloat(rewardRate.rewardRateFormatted);
        const annualRewards = rewardRatePerSecond * 365 * 24 * 60 * 60;
        const apr =
          rewardRate.isRewardsActive && totalDepositsUSD > 0
            ? ((annualRewards / totalDepositsUSD) * 100).toFixed(2)
            : "0";

        // Calculate estimated earnings (30 days)
        const dailyRewards = rewardRatePerSecond * 24 * 60 * 60;
        const monthlyRewards = dailyRewards * 30;
        const estimatedEarnings = rewardRate.isRewardsActive
          ? monthlyRewards.toFixed(2)
          : "0";

        setVaultData({
          deposits: totalDepositsUSD.toFixed(2),
          apr,
          estimatedEarnings,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching vault data:", error);
        setLoading(false);
      }
    };

    fetchVaultData();
  }, [publicKey, isPoolInitialized]);

  return (
    <div className="w-full p-6 flex gap-4">
      {/* Earning Stats */}
      <div className="w-full md:w-[60%] bg-button-grad p-0.5 rounded-7 ">
        <div className="flex flex-col gap-2 w-full h-full bg-card-grad rounded-7 justify-around">
          <div className="px-4 py-2">
            <p className="text-white text-base font-bold">My Earning Vault</p>
          </div>
          <HorizontalDivider />
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <StatItem
                iconSrc="/img/earn/solana-wallet.svg"
                label="My Deposits"
                value={`$${vaultData.deposits}`}
                altText="solana-wallet"
              />
              <StatItem
                iconSrc="/img/earn/upwards-bars.svg"
                label="Current APR"
                value={`${vaultData.apr}%`}
                altText="Increasing bar graph"
              />
              <StatItem
                iconSrc="/img/earn/earning-diamond.svg"
                label="Estimated 30d Earnings"
                value={`$${vaultData.estimatedEarnings}`}
                altText="Earning diamond"
              />
            </>
          )}
        </div>
      </div>

      {/* Entry Section */}
      <EntryCard
        isDeposit={isDeposit}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collateralType={collateralType}
        setCollateralType={setCollateralType}
        amount={amount}
        setAmount={setAmount}
        handleCardClick={() => setIsModalOpen(true)}
        setIsModalOpen={setIsModalOpen}
      />

      <ModalV2 isOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <EntryCard
          isDeposit={isDeposit}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collateralType={collateralType}
          setCollateralType={setCollateralType}
          amount={amount}
          setAmount={setAmount}
          isModalForm
          handleCardClick={() => setIsModalOpen(true)}
          setIsModalOpen={setIsModalOpen}
        />
      </ModalV2>
    </div>
  );
};

export default EarnSection;
