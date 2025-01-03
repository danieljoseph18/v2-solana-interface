"use client";

import React from "react";

function FooterBanner() {
  // operational, reduced-service, undergoing-maintenance
  const status = process.env.NEXT_PUBLIC_APP_STATUS || "operational";

  const year = new Date().getFullYear();

  return (
    <div className="bg-black border-t-2 border-t-cardborder px-2 md:px-8 pt-4 md:pb-4 pb-48  font-medium text-sm md:fixed bottom-0 left-0 right-0 z-50">
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
              <div className="bg-printer-orange w-2 h-2 rounded-full relative">
                <div className="bg-printer-orange opacity-40 w-3 h-3 absolute -bottom-0.5 -left-0.5 animate-ping rounded-full"></div>
              </div>
              <p className="text-white">Reduced Service</p>
            </div>
          ) : status === "undergoing-maintenance" ? (
            <div className="flex items-center gap-4">
              <div className="bg-printer-red w-2 h-2 rounded-full relative">
                <div className="bg-printer-red opacity-40 w-3 h-3 absolute -bottom-0.5 -left-0.5 animate-ping rounded-full"></div>
              </div>
              <p className="text-white">Undergoing Maintenance</p>
            </div>
          ) : null}
          <p className="text-base-gray">
            Version number - Private Beta v0.0.1 Testnet
          </p>
        </div>

        <p className="text-base-gray ">
          ©{year} Odin Labs. All Rights Reserved
        </p>
      </div>
    </div>
  );
}

export default FooterBanner;
