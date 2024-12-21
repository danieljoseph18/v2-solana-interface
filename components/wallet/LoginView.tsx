"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import GoogleIcon from "@/app/assets/wallet/google-icon.png";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";
import { helperToast } from "@/lib/helperToast";
import { usePrivy } from "@privy-io/react-auth";

const LoginView = ({ handleBackClick }: { handleBackClick: () => void }) => {
  const [email, setEmail] = useState("");

  const { login, authenticated } = usePrivy();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ prefill: { type: "email", value: email } });
  };

  const handleWalletLogin = () => {
    login();
  };

  const handleGoogleLogin = () => {
    login({ loginMethods: ["google"] });
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
        <form className="flex flex-col space-y-6 flex-grow">
          <div className="space-y-2">
            <label className="block text-sm text-gray-three">
              Email<span className="text-blue-500">*</span>
            </label>
            <div className="w-full p-3 rounded-lg bg-card-grad text-gray-three border border-cardborder">
              <input
                type="email"
                placeholder="youremail@domain.com"
                className="w-full rounded-lg bg-transparent focus:border-none outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="text-sm text-gray-three flex items-center gap-2">
            <p>Protected by</p>
            <img
              src="/images/account/privy-logo.svg"
              alt="Privy"
              className="h-3"
            />
          </div>
          <Button
            size="lg"
            className="w-full bg-green-grad hover:bg-green-grad-hover text-white py-4! px-4 rounded-[53px] border-printer-green border-1"
            onPress={handleWalletLogin}
          >
            Connect Wallet
          </Button>
        </form>
        <div className="flex items-center gap-2 w-full">
          <div className="w-full h-[1px] bg-white"></div>
          <span className="text-sm text-dashboard-gray">OR</span>
          <div className="w-full h-[1px] bg-white"></div>
        </div>
        <Button
          size="lg"
          className="w-full bg-white-card-grad text-black font-medium py-4! px-4 flex items-center justify-center gap-2 rounded-[53px] border-white border-1"
          onPress={handleGoogleLogin}
        >
          <Image src={GoogleIcon} alt="Google" className="w-6 h-6" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default LoginView;
