import React, { useState, useEffect } from "react";
import BottomNavLink from "./BottomNavLink";
import {
  HomeIcon,
  TradeIcon,
  EarnIcon,
  DotsIcon,
  CreateMarketIcon,
  // RewardsIcon,
} from "@/config/svgs";

const BottomNavLinks = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if ((event.target as HTMLElement).closest(".dropdown-container") === null) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    if (openDropdown) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="flex flex-row w-full justify-around items-center">
      <BottomNavLink
        path="https://v2-homepage.vercel.app/" // Homepage
        label="Home"
        svgContent={HomeIcon}
      />
      <BottomNavLink path="/trade" label="Trade" svgContent={TradeIcon} />
      <BottomNavLink path="/earn" label="Earn" svgContent={EarnIcon} />
      <BottomNavLink
        path="/create"
        label="Create"
        svgContent={CreateMarketIcon}
      />
      <BottomNavLink
        path=""
        label=""
        svgContent={DotsIcon}
        options={[
          {
            href: "/referrals",
            label: "Referrals",
            description: "Get rewards for referring friends",
            icon: "/img/common/referral-tier-trophy.png",
          },
          {
            href: "/airdrop",
            label: "Airdrop",
            description: "Airdrop",
            icon: "/img/airdrop/flaming-xp.png",
          },
        ]}
        isOpen={openDropdown === "Ecosystem"}
        onToggle={() => handleDropdownToggle("Ecosystem")}
      />
    </div>
  );
};

export default BottomNavLinks;
