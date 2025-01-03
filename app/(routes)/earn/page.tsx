"use client";

import EarnSection from "@/components/earn/EarnSection";
import RewardSection from "@/components/earn/RewardSection";
import useWindowSize from "@/hooks/useWindowSize";
import { useEffect, useState, useCallback } from "react";
import EntryButtons from "@/components/earn/EntryButtons";
import {
  getClaimableRewards,
  getAllTimeRewards,
} from "@/lib/web3/actions/getRewards";
import { useWallet } from "@/hooks/useWallet";
import { PublicKey, Transaction } from "@solana/web3.js";
import { contractAddresses, getCurrentNetwork } from "@/lib/web3/config";
import EarnBanner from "@/components/earn/EarnBanner";

const EarnPage = () => {
  const [rewards, setRewards] = useState({
    earnedToDate: { amount: "0", usdValue: "0" },
    availableToClaim: 0,
  });
  const [isPositive, setIsPositive] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPoolInitialized, setIsPoolInitialized] = useState<boolean>(false);
  const { width } = useWindowSize();
  const {
    program,
    connection,
    address: publicKey,
    signTransaction,
  } = useWallet();

  const checkPool = useCallback(async () => {
    const network = getCurrentNetwork();
    const poolAddress = new PublicKey(contractAddresses[network].poolStatePda);

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
  }, [connection]);

  const fetchData = useCallback(async () => {
    if (!publicKey || !program) return;

    const [allTimeRewards, claimableRewards] = await Promise.all([
      getAllTimeRewards(program, new PublicKey(publicKey)),
      getClaimableRewards(program, new PublicKey(publicKey)),
    ]);

    setRewards({
      earnedToDate: {
        amount: allTimeRewards.totalRewardsFormatted,
        usdValue: allTimeRewards.totalRewardsFormatted,
      },
      availableToClaim: parseFloat(claimableRewards.formattedAmount),
    });
  }, [publicKey, program]);

  useEffect(() => {
    checkPool();
  }, [checkPool]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="pb-32">
      <EarnBanner />
      <EarnSection
        isPoolInitialized={isPoolInitialized}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <RewardSection
        earnedToDate={rewards.earnedToDate}
        availableToClaim={rewards.availableToClaim}
        program={program}
        connection={connection}
        publicKey={publicKey ? new PublicKey(publicKey) : null}
        signTransaction={
          signTransaction || (() => Promise.resolve(new Transaction()))
        }
      />
      {width && width < 1024 && (
        <EntryButtons
          positiveText="Deposit"
          negativeText="Withdraw"
          title="Manage your vault"
          mobileVariant
          onClick={() => setIsModalOpen(true)}
          isPositive={isPositive}
          setIsPositive={setIsPositive}
          showIcons={false}
        />
      )}
    </div>
  );
};

export default EarnPage;
