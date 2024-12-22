"use client";

import React, { ReactNode, useMemo } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { BottomNavProvider } from "@/contexts/BottomNavContext";
import { AccountProvider } from "@/contexts/AccountContext";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { getRpcUrl } from "@/lib/web3/config";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  // You can also provide your custom RPC endpoint
  const endpoint = getRpcUrl() || clusterApiUrl("mainnet-beta");

  // Initialize all the wallets you want to use
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AccountProvider>
            <BottomNavProvider>
              <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
            </BottomNavProvider>
          </AccountProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
