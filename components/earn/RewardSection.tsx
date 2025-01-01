import { Button } from "@nextui-org/react";
import HorizontalDivider from "../common/HorizontalDivider";
import { claimRewards } from "@/lib/web3/actions/claimRewards";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { SolanaLiquidityPool } from "@/lib/web3/idl/solana_liquidity_pool.types";

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
    <div className="w-full p-6 flex gap-4">
      <div className="w-full bg-button-grad p-0.5 rounded-7">
        <div className="flex flex-col gap-2 w-full h-full bg-card-grad rounded-7">
          <div className="flex items-center justify-start px-4 py-3">
            <p className="text-white text-base font-bold">Rewards</p>
          </div>
          <HorizontalDivider />

          {/* Responsive Rewards Content */}
          <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-2 pb-4">
            <div className="flex flex-col flex-grow gap-2 pt-2 pb-4">
              <p className="text-xs text-gray-text">Earned to date:</p>
              <p className="text-white text-base font-bold">
                {earnedToDate.amount} USDC{" "}
                <span className="text-gray-text text-xs font-medium">
                  ${earnedToDate.usdValue}
                </span>
              </p>
            </div>

            {/* Mobile Divider */}
            <div className="md:hidden">
              <HorizontalDivider />
            </div>

            <div className="flex flex-row flex-grow items-center gap-2 py-4">
              <div className="flex flex-col flex-grow gap-2">
                <p className="text-xs text-gray-text">Available to claim:</p>
                <p className="text-white text-base font-bold">
                  {availableToClaim} USDC{" "}
                  <span className="text-gray-text text-xs font-medium">
                    ${availableToClaim}
                  </span>
                </p>
              </div>
              <div className="flex-grow">
                <Button
                  onPress={handleClaimRewards}
                  className="w-full h-full bg-green-grad hover:bg-green-grad-hover py-3 rounded-3 border-2 border-printer-green"
                >
                  Claim Rewards
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardSection;
