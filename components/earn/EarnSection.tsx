import { useState, useEffect } from "react";
import HorizontalDivider from "../common/HorizontalDivider";
import EntryCard from "./EntryCard";
import ModalV2 from "../common/ModalV2";
import { TabType, CollateralType } from "@/types/earn";
import LoadingSpinner from "../common/LoadingSpinner";
import { useWallet } from "@/hooks/useWallet";
import { PublicKey } from "@solana/web3.js";
import { idl } from "@/lib/web3/idl/solana_liquidity_pool";
import { SolanaLiquidityPool } from "@/lib/web3/idl/solana_liquidity_pool.types";
import { Program } from "@coral-xyz/anchor";
import { contractAddresses } from "@/lib/web3/config";
import { fetchCollateralPrices } from "@/app/actions/fetchCollateralPrices";
import { getLpTokenPrice } from "@/lib/web3/actions/getLpTokenPrice";
import { getUserLpBalance } from "@/lib/web3/actions/getLpTokenBalance";
import { getPendingRewards } from "@/lib/web3/actions/getPendingRewards";
import { getCurrentRewardRate } from "@/lib/web3/actions/getCurrentRewardRate";
import SolanaWallet from "@/app/assets/earn/solana-wallet.svg";
import UpwardsBars from "@/app/assets/earn/upwards-bars.svg";
import EarningDiamond from "@/app/assets/earn/earning-diamond.svg";

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

const EarnSection = ({ isPoolInitialized }: { isPoolInitialized: boolean }) => {
  const { address: publicKey, connection } = useWallet();

  const [activeTab, setActiveTab] = useState<TabType>("deposit");
  const [collateralType, setCollateralType] = useState<CollateralType>("SOL");
  const [amount, setAmount] = useState<string>("0");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [vaultData, setVaultData] = useState<{
    deposits: string;
    apr: string;
    estimatedEarnings: string;
  }>({
    deposits: "0",
    apr: "0",
    estimatedEarnings: "0",
  });
  const [prices, setPrices] = useState<{
    solPrice: number;
    usdcPrice: number;
  }>({
    solPrice: 0,
    usdcPrice: 0,
  });
  const [lpTokenPrice, setLpTokenPrice] = useState<number>(1);
  const [balancesUsd, setBalancesUsd] = useState<{
    solBalanceUsd: number;
    usdcBalanceUsd: number;
  }>({
    solBalanceUsd: 0,
    usdcBalanceUsd: 0,
  });
  const [lpBalance, setLpBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const isDeposit = activeTab === "deposit";

  const program = new Program(idl as SolanaLiquidityPool, {
    connection,
  });

  useEffect(() => {
    const fetchPrices = async () => {
      const prices = await fetchCollateralPrices();
      setPrices(prices);
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    const fetchLpTokenPrice = async () => {
      const poolAddress = new PublicKey(contractAddresses.devnet.poolStatePda);
      const lpTokenPrice = await getLpTokenPrice(program, poolAddress);
      setLpTokenPrice(lpTokenPrice);
    };
    fetchLpTokenPrice();
  }, [program]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!publicKey) return;
      const balanceData = await getUserBalances(new PublicKey(publicKey));
      const solBalanceUsd = parseInt(balanceData.solBalance) * prices.solPrice;
      const usdcBalanceUsd =
        parseInt(balanceData.usdcBalance) * prices.usdcPrice;
      const balances = {
        solBalanceUsd,
        usdcBalanceUsd,
      };
      setBalancesUsd(balances);
    };
    fetchBalances();
  }, [publicKey]);

  useEffect(() => {
    const fetchLpBalance = async () => {
      if (!publicKey) return;
      const lpBalance = await getUserLpBalance(
        program,
        new PublicKey(publicKey)
      );
      setLpBalance(lpBalance);
    };
    fetchLpBalance();
  }, [program, publicKey]);

  /**
   * @dev Returns an estimate of their share of the pool. (NOT ACTUAL BALANCES)
   */
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
          getCurrentRewardRate(program, poolAddress, isPoolInitialized),
          getPendingRewards(
            program,
            poolAddress,
            new PublicKey(publicKey),
            isPoolInitialized
          ),
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
                iconSrc={SolanaWallet}
                label="My Deposits"
                value={`$${vaultData.deposits}`}
                altText="solana-wallet"
              />
              <StatItem
                iconSrc={UpwardsBars}
                label="Current APR"
                value={`${vaultData.apr}%`}
                altText="Increasing bar graph"
              />
              <StatItem
                iconSrc={EarningDiamond}
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
        prices={prices}
        lpTokenPrice={lpTokenPrice}
        lpBalance={lpBalance}
        balancesUsd={balancesUsd}
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
          prices={prices}
          lpTokenPrice={lpTokenPrice}
          balancesUsd={balancesUsd}
          lpBalance={lpBalance}
          handleCardClick={() => setIsModalOpen(true)}
          setIsModalOpen={setIsModalOpen}
        />
      </ModalV2>
    </div>
  );
};

export default EarnSection;
