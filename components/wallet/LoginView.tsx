"use client";

import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useWallet as useCustomWallet } from "@/hooks/useWallet";
import Image from "next/image";

const LoginView = ({ handleBackClick }: { handleBackClick: () => void }) => {
  const {
    isConnected,
    isConnecting,
    connect,
    availableWallets,
    selectedWallet,
  } = useCustomWallet();
  const [showWalletList, setShowWalletList] = useState(false);

  const getButtonText = () => {
    if (isConnecting) return "Connecting...";
    if (isConnected) return "Wallet Connected";
    if (availableWallets.length === 0) return "Install Solana Wallet";
    if (selectedWallet) return `Connect ${selectedWallet.adapter.name}`;
    return "Select Wallet";
  };

  return (
    <div className="min-h-screen bg-card-grad text-white p-4">
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <div className="flex w-full justify-start items-center">
          <div
            className="flex items-center justify-center bg-input-grad border-2 border-cardborder !rounded-3 p-3 hover:opacity-80 transition-opacity cursor-pointer"
            onClick={handleBackClick}
          >
            <FaArrowLeft className="text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-medium text-left w-full">
          Connect Your Wallet
        </h1>
        <p className="text-gray-text text-left w-full font-medium text-15 mb-4">
          Connect your Solana wallet to start trading on PRINT3R!
        </p>

        {/* Main Button */}
        <button
          onClick={() => {
            if (selectedWallet) {
              connect(selectedWallet.adapter.name);
            } else {
              setShowWalletList(true);
            }
          }}
          disabled={isConnecting || availableWallets.length === 0}
          className={`w-full bg-green-grad hover:bg-green-grad-hover text-white py-4 px-4 rounded-[53px] border-printer-green border-1 ${
            isConnecting || availableWallets.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {getButtonText()}
        </button>

        {/* Wallet List */}
        {showWalletList && !isConnected && (
          <div className="w-full mt-4 bg-input-grad rounded-lg border border-cardborder p-4">
            <h3 className="text-lg font-medium mb-3">Select a wallet</h3>
            <div className="space-y-2">
              {availableWallets.map((wallet) => (
                <button
                  key={wallet.adapter.name}
                  onClick={() => {
                    connect(wallet.adapter.name);
                    setShowWalletList(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-black/20 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    {wallet.adapter.icon && (
                      <Image
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        width={24}
                        height={24}
                      />
                    )}
                    {wallet.adapter.name}
                  </span>
                  {selectedWallet?.adapter.name === wallet.adapter.name && (
                    <span className="text-green-500">Selected</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {availableWallets.length === 0 && (
          <p className="text-yellow-500 mt-4">
            No Solana wallet detected. Please install a wallet like Phantom or
            Solflare.
          </p>
        )}

        {isConnected && (
          <p className="text-green-500 mt-4">
            Wallet connected successfully! You can now start trading.
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginView;
