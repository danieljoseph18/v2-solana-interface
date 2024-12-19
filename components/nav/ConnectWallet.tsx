import { useState } from "react";
import Image from "next/image";

const ConnectWallet = ({ styles }: { styles: string }) => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div>
      <button className={styles} onClick={() => {}}>
        <Image
          src="/img/nav/wallet-icon.png"
          className="w-5 h-auto sm:mr-2"
          alt="Wallet Icon"
          width={128}
          height={128}
        />
        <span className="hidden sm:inline-block">
          {isConnected ? "My Wallet" : "Connect"}
        </span>
      </button>
    </div>
  );
};

export default ConnectWallet;
