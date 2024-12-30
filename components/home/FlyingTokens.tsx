"use client";

import React from "react";
import Ai16z from "@/app/assets/home/ai16z-logo.png";
import Drugs from "@/app/assets/home/drugs-logo.png";
import Girlie from "@/app/assets/home/girlie-logo.png";
import Haiyez from "@/app/assets/home/haiyez-logo.png";
import L8Cap from "@/app/assets/home/l8cap-logo.png";
import Monopoly from "@/app/assets/home/monopoly-logo.png";
import Topkek from "@/app/assets/home/topkek-logo.png";
import XCombinator from "@/app/assets/home/xcombinator-logo.png";

import HomeToken from "./HomeToken";
import useWindowSize from "@/hooks/useWindowSize";

const FlyingTokens = () => {
  const { width } = useWindowSize();

  const isMobile = width && width < 768;

  const flyingTokens = [
    { token: Haiyez, size: 50, top: 0.2, left: 0.1 },
    { token: Monopoly, size: 80, top: -0.05, left: 0.3 },
    { token: Girlie, size: 70, top: 0.1, left: 0.85 },
    { token: Ai16z, size: 150, top: 0.5, left: 0.3 },
    { token: L8Cap, size: 80, top: 0.4, left: 0.85 },
    { token: Drugs, size: 150, top: 0.8, left: 0.05 },
    { token: XCombinator, size: 110, top: 0.8, left: 0.7 },
    { token: Topkek, size: 200, top: 0.6, left: 1 },
  ];

  const flyingTokensMobile = [
    { token: Drugs, size: 120, top: 0.1, left: -0.1 },
    { token: Girlie, size: 50, top: 0.15, left: 0.95 },
    { token: Ai16z, size: 50, top: 0.8, left: -0.05 },
    { token: Topkek, size: 100, top: 0.8, left: 0.95 },
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
