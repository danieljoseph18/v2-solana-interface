import Image from "next/image";
import { useAccountOverlay } from "@/contexts/AccountContext";
import { useWallet } from "@solana/wallet-adapter-react";
import WalletIcon from "@/app/assets/nav/wallet-icon.png";

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
          src={WalletIcon}
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
