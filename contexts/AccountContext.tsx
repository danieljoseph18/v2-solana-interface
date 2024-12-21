"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AccountContextType {
  isAccountOverlayOpen: boolean;
  openAccountOverlay: () => void;
  closeAccountOverlay: () => void;
  hasConnectedBefore: boolean;
  setHasConnectedBefore: (value: boolean) => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAccountOverlayOpen, setIsAccountOverlayOpen] = useState(false);
  const [hasConnectedBefore, setHasConnectedBefore] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const hasConnected = localStorage.getItem("hasConnectedSmartAccount");
    if (hasConnected === "true") {
      setHasConnectedBefore(true);
    }
  }, []);

  const openAccountOverlay = () => setIsAccountOverlayOpen(true);
  const closeAccountOverlay = () => setIsAccountOverlayOpen(false);

  return (
    <AccountContext.Provider
      value={{
        isAccountOverlayOpen,
        openAccountOverlay,
        closeAccountOverlay,
        hasConnectedBefore,
        setHasConnectedBefore,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountOverlay = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccountOverlay must be used within a AccountProvider");
  }
  return context;
};
