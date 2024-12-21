"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { BottomNavProvider } from "@/contexts/BottomNavContext";
import { AccountProvider } from "@/contexts/AccountContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <AccountProvider>
      <BottomNavProvider>
        <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
      </BottomNavProvider>
    </AccountProvider>
  );
}
