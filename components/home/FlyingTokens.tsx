"use client";

import React from "react";
import WSVG from "@/app/assets/home/w.svg";
import BaycSVG from "@/app/assets/home/bayc.svg";
import ArbSVG from "@/app/assets/home/arb.svg";
import WifSVG from "@/app/assets/home/wif.svg";
import PepeSVG from "@/app/assets/home/pepe.svg";
import PudgySVG from "@/app/assets/home/pudgy.svg";
import EthSVG from "@/app/assets/home/eth.svg";
import SolanaSVG from "@/app/assets/home/solana.svg";
import HomeToken from "./HomeToken";
import useWindowSize from "@/hooks/useWindowSize";

const FlyingTokens = () => {
  const { width } = useWindowSize();

  const isMobile = width && width < 768;

  const flyingTokens = [
    { token: PepeSVG, size: 50, top: 0.2, left: 0.1 },

    { token: WSVG, size: 80, top: -0.05, left: 0.3 },

    { token: ArbSVG, size: 70, top: 0.1, left: 0.85 },

    { token: EthSVG, size: 150, top: 0.5, left: 0.3 },

    { token: PudgySVG, size: 80, top: 0.4, left: 0.85 },

    { token: BaycSVG, size: 150, top: 0.8, left: 0.05 },

    { token: WifSVG, size: 110, top: 0.8, left: 0.7 },

    { token: SolanaSVG, size: 200, top: 0.6, left: 1 },
  ];

  const flyingTokensMobile = [
    { token: EthSVG, size: 120, top: 0.1, left: -0.1 },
    { token: ArbSVG, size: 50, top: 0.15, left: 0.95 },
    { token: PudgySVG, size: 50, top: 0.8, left: -0.05 },
    { token: WifSVG, size: 100, top: 0.8, left: 0.95 },
  ];

  return (
    <div className="h-full w-full absolute top-0 left-0 right-0 bottom-0 overflow-hidden z-0">
      {isMobile
        ? flyingTokensMobile.map((t, index) => (
            <HomeToken
              key={index}
              token={t.token}
              size={t.size}
              top={t.top}
              left={t.left}
            />
          ))
        : flyingTokens.map((t, index) => (
            <HomeToken
              key={index}
              token={t.token}
              size={t.size}
              top={t.top}
              left={t.left}
            />
          ))}
    </div>
  );
};

export default FlyingTokens;
