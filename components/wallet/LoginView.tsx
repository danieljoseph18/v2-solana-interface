"use client";

import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const LoginView = ({ handleBackClick }: { handleBackClick: () => void }) => {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-card-grad text-white p-4">
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <div className="flex w-full justify-start items-center">
          <div
            className="flex items-center justify-center bg-input-grad border-2 border-cardborder rounded-3 p-3 hover:opacity-80 transition-opacity cursor-pointer"
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

        {/* Wallet Connect Button */}
        <WalletMultiButton className="w-full bg-green-grad! hover:bg-green-grad-hover text-white py-4 px-4 rounded-[53px] border-printer-green border-1" />

        {connected && (
          <p className="text-green-500 mt-4">
            Wallet connected successfully! You can now start trading.
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginView;
