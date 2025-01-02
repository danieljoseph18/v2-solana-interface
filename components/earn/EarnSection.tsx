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
import { contractAddresses, getCurrentNetwork } from "@/lib/web3/config";
import { fetchCollateralPrices } from "@/app/actions/fetchCollateralPrices";
import { getLpTokenPrice } from "@/lib/web3/actions/getLpTokenPrice";
import { getUserLpBalance } from "@/lib/web3/actions/getLpTokenBalance";
import SolanaWallet from "@/app/assets/earn/solana-wallet.svg";
import UpwardsBars from "@/app/assets/earn/upwards-bars.svg";
import EarningDiamond from "@/app/assets/earn/earning-diamond.svg";
import Image from "next/image";
import { getUserBalances } from "@/lib/web3/actions/getUserBalances";
import { getApr } from "@/lib/web3/actions/getApr";
import { getLpTokenSupply } from "@/lib/web3/actions/getLpTokenSupply";
import { formatFloatWithCommas } from "@/lib/web3/formatters";

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
      <Image src={iconSrc} alt={altText} width={35} height={35} />
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

  const refreshBalances = async () => {
    await Promise.all([fetchBalances(), fetchLpBalance()]);
  };

  const fetchBalances = async () => {
    if (!publicKey || !prices.solPrice || !prices.usdcPrice || !connection)
      return;
    const balanceData = await getUserBalances(
      connection,
      new PublicKey(publicKey)
    );

    const solBalanceUsd = parseInt(balanceData.solBalance) * prices.solPrice;

    const usdcBalanceUsd = parseInt(balanceData.usdcBalance) * prices.usdcPrice;

    const balances = {
      solBalanceUsd,
      usdcBalanceUsd,
    };
    setBalancesUsd(balances);
  };

  const fetchLpBalance = async () => {
    if (!publicKey) return;
    const lpBalance = await getUserLpBalance(
      connection,
      new PublicKey(publicKey)
    );
    setLpBalance(lpBalance);
  };

  useEffect(() => {
    const fetchPrices = async () => {
      const prices = await fetchCollateralPrices();
      setPrices(prices);
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    const fetchLpTokenPrice = async () => {
      const network = getCurrentNetwork();
      const poolAddress = new PublicKey(
        contractAddresses[network].poolStatePda
      );
      const lpTokenPrice = await getLpTokenPrice(program, poolAddress);
      setLpTokenPrice(lpTokenPrice);
    };
    fetchLpTokenPrice();
  }, [program]);

  useEffect(() => {
    fetchBalances();
  }, [publicKey, prices.solPrice, prices.usdcPrice, connection]);

  useEffect(() => {
    fetchLpBalance();
  }, [connection, publicKey]);

  useEffect(() => {
    const fetchVaultData = async () => {
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

        const deposits = lpBalance * lpTokenPrice;

        const aprs = await getApr(program);

        const monthlyRewards = aprs.rewardRatePerSecond * 30 * 24 * 60 * 60;

        // 30d earnings = monthlyRewards * percentage of supply owned

        const [lpTokenBalance, lpTokenSupply] = await Promise.all([
          getUserLpBalance(connection, new PublicKey(publicKey)),
          getLpTokenSupply(connection),
        ]);

        const percentageOfSupply = lpTokenBalance / lpTokenSupply;

        const estimatedEarnings = monthlyRewards * percentageOfSupply;

        setVaultData({
          deposits: deposits.toFixed(2),
          apr: aprs.formattedApr,
          estimatedEarnings: estimatedEarnings.toFixed(2),
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching vault data:", error);
        setLoading(false);
      }
    };

    fetchVaultData();
  }, [publicKey, isPoolInitialized, lpBalance, lpTokenPrice]);

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
                value={`${vaultData.apr}`}
                altText="Increasing bar graph"
              />
              <StatItem
                iconSrc={EarningDiamond}
                label="Estimated 30d Earnings"
                value={`$${formatFloatWithCommas(
                  parseFloat(vaultData.estimatedEarnings)
                )}`}
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
        setIsModalOpen={setIsModalOpen}
        refetchBalances={refreshBalances}
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
          setIsModalOpen={setIsModalOpen}
          refetchBalances={refreshBalances}
        />
      </ModalV2>
    </div>
  );
};

export default EarnSection;
