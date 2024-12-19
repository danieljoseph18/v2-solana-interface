"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { BottomNavProvider } from "@/contexts/BottomNavContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <BottomNavProvider>
      <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
    </BottomNavProvider>
  );
}
