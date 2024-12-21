"use client";

import dynamic from "next/dynamic";

const AccountOverlay = dynamic(() => import("./AccountOverlay"), {
  ssr: false,
});

export default function ClientWrapper() {
  return <AccountOverlay />;
}
