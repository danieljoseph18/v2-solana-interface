import { useState } from "react";
import Image from "next/image";
import { useAccountOverlay } from "@/contexts/AccountContext";
import { useWallet } from "@solana/wallet-adapter-react";

const ConnectWallet = ({ styles }: { styles: string }) => {
  const { connected } = useWallet();
  const { openAccountOverlay } = useAccountOverlay();

  const handleClick = () => {
    openAccountOverlay();
  };

  return (
    <div>
      <button className={styles} onClick={handleClick}>
        <Image
          src="/img/nav/wallet-icon.png"
          className="w-5 h-auto sm:mr-2"
          alt="Wallet Icon"
          width={128}
          height={128}
        />
        <span className="hidden sm:inline-block">
          {connected ? "My Wallet" : "Connect"}
        </span>
      </button>
    </div>
  );
};

export default ConnectWallet;
