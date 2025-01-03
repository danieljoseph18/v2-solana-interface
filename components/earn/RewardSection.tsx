import { Button } from "@nextui-org/react";
import HorizontalDivider from "../common/HorizontalDivider";
import { claimRewards } from "@/lib/web3/actions/claimRewards";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { SolanaLiquidityPool } from "@/lib/web3/idl/solana_liquidity_pool.types";
import CashIcon from "@/app/assets/earn/cash-icon.png";
import FlamingUsdc from "@/app/assets/earn/flaming-usdc.png";
import Image from "next/image";

interface RewardSectionProps {
  program: Program<SolanaLiquidityPool> | null;
  connection: Connection;
  publicKey: PublicKey | null;
  earnedToDate: {
    amount: string;
    usdValue: string;
  };
  availableToClaim: number;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
}

const RewardSection = ({
  program,
  connection,
  publicKey,
  earnedToDate,
  availableToClaim,
  signTransaction,
}: RewardSectionProps) => {
  const handleClaimRewards = async () => {
    if (!publicKey || !program) return;
    const result = await claimRewards(
      program,
      connection,
      publicKey,
      signTransaction
    );
    console.log(result);
  };

  return (
    <div className="w-full p-6 flex gap-4 pb-6 md:pb-32 lg:pb-6">
      <div className="flex flex-col gap-2 w-full h-full bg-card-grad border-2 border-cardborder modal-gradient-shadow rounded-7 py-4 md:py-0">
        <div className="flex items-center justify-start px-4 py-3">
          <p className="text-white text-base font-bold">Rewards</p>
        </div>
        <HorizontalDivider />

        {/* Responsive Rewards Content */}
        <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-2 pb-4 gap-4">
          {/* Earned to Date - 1/3 width */}
          <div className="flex flex-row items-center justify-start w-full md:w-1/3 gap-2">
            <Image src={CashIcon} alt="Cash Icon" width={52} height={52} />
            <div className="flex flex-col flex-grow gap-2 pt-2 pb-4">
              <div className="flex flex-row items-center gap-2">
                <p className="text-xs text-gray-text">Earned to date:</p>
              </div>
              <p className="text-white text-base font-bold">
                {earnedToDate.amount} USDC{" "}
                <span className="text-printer-green text-xs font-medium">
                  ${earnedToDate.usdValue}
                </span>
              </p>
            </div>
          </div>

          {/* Available to Claim - 1/3 width */}
          <div className="flex flex-row items-center justify-start w-full md:w-1/3 gap-2">
            <Image
              src={FlamingUsdc}
              alt="Flaming Usdc"
              width={39}
              height={56}
            />
            <div className="flex flex-col flex-grow gap-2">
              <div className="flex flex-row items-center gap-2">
                <p className="text-xs text-earn-gray">Available to claim:</p>
              </div>
              <p className="text-printer-green text-base font-bold text-nowrap">
                {availableToClaim.toFixed(2)} USDC{" "}
                <span className="text-printer-green text-xs font-medium ml-2">
                  ${availableToClaim.toFixed(2)}
                </span>
              </p>
            </div>
          </div>

          {/* Claim Button - 1/3 width */}
          <div className="w-full md:w-1/3 mt-6 md:mt-0 flex justify-end">
            <Button
              onPress={handleClaimRewards}
              className="w-full bg-green-grad hover:bg-green-grad-hover py-3 !rounded-3 border-2 border-printer-green"
            >
              Claim Rewards
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardSection;
