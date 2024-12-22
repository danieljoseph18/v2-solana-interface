"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { BottomNavProvider } from "@/contexts/BottomNavContext";
import { AccountProvider } from "@/contexts/AccountContext";
import { PrivyProvider } from "@privy-io/react-auth";
import P3Logo from "@/app/assets/nav/nav-logo.png";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const solanaConnectors = toSolanaWalletConnectors({
    shouldAutoConnect: true,
  });

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Privy appearance
        appearance: {
          theme: "dark",
          accentColor: "#8210AA",
          logo: P3Logo.src,
          walletChainType: "solana-only",
        },
        // Embedded wallets
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
    >
      <AccountProvider>
        <BottomNavProvider>
          <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
        </BottomNavProvider>
      </AccountProvider>
    </PrivyProvider>
  );
}
