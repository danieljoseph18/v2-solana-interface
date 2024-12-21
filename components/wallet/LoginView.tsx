"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import GoogleIcon from "@/app/assets/wallet/google-icon.png";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import { helperToast } from "@/lib/helperToast";

const LoginView = ({ handleBackClick }: { handleBackClick: () => void }) => {
  const [connectedWallet, setConnectedWallet] = useState<boolean>(false);

  const connectWallet = async () => {
    console.log("connectWallet");
  };

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
          Log In / Sign Up
        </h1>
        <p className="text-gray-text text-left w-full font-medium text-15 mb-4">
          Create a PRINT3R Wallet & start trading in just a few clicks!
        </p>
        <Button
          size="lg"
          className="w-full bg-green-grad hover:bg-green-grad-hover text-white py-4! px-4 rounded-[53px] border-printer-green border-1"
          onPress={connectWallet}
        >
          Connect Wallet
        </Button>
        <div className="flex items-center gap-2 w-full">
          <div className="w-full h-[1px] bg-white"></div>
          <span className="text-sm text-dashboard-gray">OR</span>
          <div className="w-full h-[1px] bg-white"></div>
        </div>
        <Button
          size="lg"
          className="w-full bg-white-card-grad text-black font-medium py-4! px-4 flex items-center justify-center gap-2 rounded-[53px] border-white border-1"
          onPress={connectWallet}
        >
          <Image src={GoogleIcon} alt="Google" className="w-6 h-6" />
          Sign in with Google
        </Button>
        <div className="flex items-center justify-center gap-2 w-full py-6">
          <span className="text-sm text-dashboard-gray font-medium">
            Already have an account?
          </span>
          <span
            className="text-sm text-printer-green font-bold cursor-pointer hover:text-green-bottom transition-colors"
            onClick={connectWallet}
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
