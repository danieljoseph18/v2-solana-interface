"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { BottomNavProvider } from "@/contexts/BottomNavContext";
import { AccountProvider } from "@/contexts/AccountContext";
import { PrivyProvider } from "@privy-io/react-auth";
import P3Logo from "@/app/assets/nav/nav-logo.png";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: "dark",
          accentColor: "#8210AA",
          logo: P3Logo.src,
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
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
