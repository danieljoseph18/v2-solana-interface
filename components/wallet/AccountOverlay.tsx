"use client";

import { useState } from "react";
import { useAccountOverlay } from "@/contexts/AccountContext";
import InitialView from "./InitialView";
import LoginView from "./LoginView";
import DashboardView from "./DashboardView";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import History from "./History";
import Settings from "./Settings";

const AccountOverlay = () => {
  const { isAccountOverlayOpen, closeAccountOverlay } = useAccountOverlay();
  const [showLoginView, setShowLoginView] = useState(false);
  const [showSwapView, setShowSwapView] = useState(false);
  const [showDepositView, setShowDepositView] = useState(false);
  const [showWithdrawView, setShowWithdrawView] = useState(false);
  const [showHistoryView, setShowHistoryView] = useState(false);
  const [showSettingsView, setShowSettingsView] = useState(false);
  const [showDashboardView, setShowDashboardView] = useState(false);
  const [prices] = useState<{ [key: string]: number }>({});
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const handleLoginClick = () => {
    setShowLoginView(true);
  };

  const handleBackClick = () => {
    setShowLoginView(false);
  };

  const handleSwapClick = () => {
    setShowSwapView(!showSwapView);
  };

  const handleDepositClick = () => {
    setShowDepositView(!showDepositView);
  };

  const handleWithdrawClick = () => {
    setShowWithdrawView(!showWithdrawView);
  };

  const handleHistoryClick = () => {
    setShowHistoryView(!showHistoryView);
  };

  const handleSettingsClick = () => {
    setShowSettingsView(!showSettingsView);
  };

  const handleRefresh = () => {
    setShouldRefresh((prev) => !prev);
  };

  if (!isAccountOverlayOpen) return null;

  let content;
  if (showDepositView) {
    content = (
      <Deposit
        handleDepositBackClick={handleDepositClick}
        prices={prices}
        onSuccess={handleRefresh}
      />
    );
  } else if (showWithdrawView) {
    content = (
      <Withdraw
        handleWithdrawBackClick={handleWithdrawClick}
        prices={prices}
        onSuccess={handleRefresh}
      />
    );
  } else if (showHistoryView) {
    content = (
      <History handleHistoryBackClick={handleHistoryClick} prices={prices} />
    );
  } else if (showSettingsView) {
    content = <Settings handleSettingsBackClick={handleSettingsClick} />;
  } else if (showDashboardView) {
    content = (
      <DashboardView
        setShowSwapView={handleSwapClick}
        setShowDepositView={handleDepositClick}
        setShowWithdrawView={handleWithdrawClick}
        setShowHistoryView={handleHistoryClick}
        setShowSettingsView={handleSettingsClick}
        closeAccountOverlay={closeAccountOverlay}
        prices={prices}
        shouldRefresh={shouldRefresh}
        setShouldRefresh={setShouldRefresh}
      />
    );
  } else if (showLoginView) {
    content = (
      <LoginView
        handleBackClick={handleBackClick}
        handleLoginClick={() => {
          setShowDashboardView(true);
        }}
      />
    );
  } else {
    content = (
      <InitialView
        onLoginClick={handleLoginClick}
        closeAccountOverlay={closeAccountOverlay}
      />
    );
  }

  return (
    <>
      {/* Overlay Background */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-40 ${
          isAccountOverlayOpen
            ? "bg-opacity-50"
            : "bg-opacity-0 pointer-events-none"
        }`}
        onClick={closeAccountOverlay}
      />

      {/* Wallet Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-card-grad shadow-xl z-50 transition-transform duration-300 ease-in-out border-l-2 border-l-cardborder pb-20 modal-gradient-shadow transform ${
          isAccountOverlayOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">{content}</div>
      </div>
    </>
  );
};

export default AccountOverlay;