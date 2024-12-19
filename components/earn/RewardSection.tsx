import { Button } from "@nextui-org/react";
import HorizontalDivider from "../common/HorizontalDivider";
import ToggleSwitch from "../common/ToggleSwitch";

interface RewardSectionProps {
  earnedToDate: {
    amount: string;
    usdValue: string;
  };
  availableToClaim: {
    amount: string;
    usdValue: string;
  };
  isAutoCompound: boolean;
  onAutoCompoundToggle: (value: boolean) => void;
  onClaimRewards?: () => void;
  type?: "stake" | "earn";
}

const RewardSection = ({
  earnedToDate,
  availableToClaim,
  isAutoCompound = false,
  onAutoCompoundToggle,
  onClaimRewards,
  type = "earn",
}: RewardSectionProps) => {
  return (
    <div className="w-full p-6 flex gap-4">
      <div className="w-full bg-button-grad p-0.5 rounded-7">
        <div className="flex flex-col gap-2 w-full h-full bg-card-grad rounded-7">
          <div className="flex items-center justify-between px-4 py-3">
            <p className="text-white text-base font-bold">Rewards</p>
            <ToggleSwitch
              value={isAutoCompound}
              setValue={onAutoCompoundToggle}
              label="Auto Compound?"
            />
          </div>
          <HorizontalDivider />

          {/* Responsive Rewards Content */}
          <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-2 pb-4">
            <div className="flex flex-col flex-grow gap-2 pt-2 pb-4">
              <p className="text-xs text-gray-text">
                {type === "stake" ? "Earned to date:" : "Accrued to date:"}
              </p>
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
                  {availableToClaim.amount} USDC{" "}
                  <span className="text-gray-text text-xs font-medium">
                    ${availableToClaim.usdValue}
                  </span>
                </p>
              </div>
              <div className="flex-grow">
                <Button
                  onPress={onClaimRewards}
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
