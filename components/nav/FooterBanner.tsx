"use client";

import React from "react";
import Verified from "@/app/assets/common/verified.svg";
import Image from "next/image";
import { usePathname } from "next/navigation";

function FooterBanner() {
  const pathname = usePathname();
  const pathsWithTour = ["/trade", "/airdrop", "/earn"];

  // operational, reduced-service, undergoing-maintenance
  const status = process.env.NEXT_PUBLIC_APP_STATUS || "operational";

  return (
    <div className="bg-black border-t-2 border-t-cardborder px-2 md:px-8 pt-4 md:pb-4 pb-28  font-medium text-sm md:fixed bottom-0 left-0 right-0 z-50">
      <div className=" flex flex-col gap-8 lg:flex-row justify-between items-center">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {status === "operational" ? (
            <div className="flex items-center gap-4">
              <div className="bg-printer-green w-2 h-2 rounded-full relative">
                <div className="bg-printer-green opacity-40 w-3 h-3 absolute -bottom-0.5 -left-0.5 animate-ping rounded-full"></div>
              </div>
              <p className="text-white">Operational</p>
            </div>
          ) : status === "reduced-service" ? (
            <div className="flex items-center gap-4">
              <div className="bg-[#F05722] w-2 h-2 rounded-full relative">
                <div className="bg-[#F05722] opacity-40 w-3 h-3 absolute -bottom-0.5 -left-0.5 animate-ping rounded-full"></div>
              </div>
              <p className="text-white">Reduced Service</p>
            </div>
          ) : status === "undergoing-maintenance" ? (
            <div className="flex items-center gap-4">
              <div className="bg-[#FA2256] w-2 h-2 rounded-full relative">
                <div className="bg-[#FA2256] opacity-40 w-3 h-3 absolute -bottom-0.5 -left-0.5 animate-ping rounded-full"></div>
              </div>
              <p className="text-white">Undergoing Maintenance</p>
            </div>
          ) : null}
          <p className="text-base-gray">
            Version number - Private Beta v0.0.1 Testnet
          </p>
          {pathsWithTour.includes(pathname) ? (
            <div
              className="flex gap-2 items-center cursor-pointer "
              onClick={() => {}}
            >
              <p className="text-printer-green hover:underline">
                Need help getting started? Click here!
              </p>
              <Image
                src={Verified}
                alt=""
                className="w-4 h-4"
                width={128}
                height={128}
              />
            </div>
          ) : null}
        </div>

        <p className="text-base-gray ">©2025 Odin Labs. All Rights Reserved</p>
      </div>
    </div>
  );
}

export default FooterBanner;
