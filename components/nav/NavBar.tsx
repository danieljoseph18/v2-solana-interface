"use client";

import React from "react";
import Link from "next/link";
import NavLinksV2 from "./NavLinksV2";
import Image from "next/image";
import NavLogo from "@/app/assets/nav/nav-logo.png";
import useWindowSize from "@/hooks/useWindowSize";
import ConnectWallet from "./ConnectWallet";
import { getImageUrlFromTokenSymbol } from "@/lib/utils/getTokenImage";

const NavBar: React.FC = () => {
  const { width } = useWindowSize();

  return (
    <nav className="flex flex-col px-2 py-4 gap-2 md:px-8 md:py-2 shadow-2xl h-fit  border-b border-cardborder bg-card-grad text-white w-screen">
      <div className="flex flex-row w-full justify-between items-center mr-4">
        <div className="flex items-center">
          <Link className="" href="/">
            <Image
              src={NavLogo}
              className="w-32 sm:w-36 md:w-44 h-auto"
              alt="PRINT Logo"
              // width={128}
              // height={128}
            />
          </Link>
        </div>

        <NavLinksV2 className="hidden lg:flex" />
        <div className="flex space-x-4 items-center">
          <button
            className="bg-input-grad border-cardborder border-2 !rounded-3 px-3 h-10 flex items-center justify-between gap-2"
            onClick={() => {}}
          >
            <div className="flex flex-row items-center gap-2">
              <Image
                src={getImageUrlFromTokenSymbol("SOL")}
                className="w-5 h-5 rounded-full"
                alt="Chain Logo"
                width={128}
                height={128}
              />

              {width && width > 768 && (
                <p className="text-sm text-white font-semibold">SOLANA</p>
              )}
            </div>
          </button>

          <ConnectWallet styles="flex items-center bg-p3-button hover:bg-p3-button-hover border-2 border-p3 text-white py-1 px-4 !rounded-3 h-10 trade-first-step" />
        </div>
      </div>
      <NavLinksV2 className="hidden md:flex lg:hidden mx-auto my-3" />
    </nav>
  );
};

export default NavBar;
