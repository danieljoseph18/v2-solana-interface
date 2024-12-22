"use client";
import React from "react";
import ScrollAnimation from "react-animate-on-scroll";
import HomeHero from "@/components/home/HomeHero";
import FeatureSection from "@/components/home/FeatureSection";
import ProtocolStats from "@/components/home/ProtocolStats";
import HomeFooter from "@/components/home/HomeFooter";
import "animate.css/animate.compat.css";
import LowerFooter from "@/components/home/LowerFooter";

const Home = () => {
  return (
    <div className="bg-home-card-grad text-white relative">
      <HomeHero />
      <div className="px-6 md:px-8 lg:px-16 xl:px-52">
        <FeatureSection
          title={
            <h2 className="text-2xl md:text-[33px] font-semibold mb-4 font-poppins">
              Trade{" "}
              <span className="bg-printer-orange-gradient text-gradient">
                Any
              </span>{" "}
              Asset,{" "}
              <span className="bg-printer-orange-gradient text-gradient">
                any
              </span>{" "}
              chain
            </h2>
          }
          description={
            <p className="text-[19px] text-[#b7b8bf] font-poppins">
              Long or short any Web3 asset on any chain, with chain agnostic
              markets - no bridging ever <br /> needed.
            </p>
          }
          imageSrc="/img/home/trade-anything.png"
          imageAlt="Trade Any Asset"
          ctaName="Trade Now"
          ctaLink="/trade"
        />
        <FeatureSection
          title={
            <h2 className="text-2xl md:text-[33px] font-semibold mb-4 font-poppins">
              Make the markets{" "}
              <span className="bg-printer-orange-gradient text-gradient">
                YOU
              </span>{" "}
              want
            </h2>
          }
          description={
            <p className="text-[19px] text-[#b7b8bf] font-poppins">
              Create new markets for any asset on any chain in just a few clicks
              and earn 10% of all trading fees <br /> for life!
            </p>
          }
          imageSrc="/img/home/tradeable-anywhere.png"
          imageAlt="Make Markets"
          reverse={true}
          ctaName="Create Market"
          ctaLink="/create"
        />
        <FeatureSection
          title={
            <h2 className="text-2xl md:text-[33px] font-semibold mb-4 font-poppins">
              Stake{" "}
              <span className="bg-printer-orange-gradient text-gradient">
                ETH
              </span>{" "}
              or{" "}
              <span className="bg-printer-orange-gradient text-gradient">
                USDC
              </span>{" "}
              to earn!
            </h2>
          }
          description={
            <p className="text-[19px] text-[#b7b8bf] font-poppins">
              Stake SOL or USDC and start earning 50% of trading fees!
            </p>
          }
          imageSrc="/img/home/stake-to-earn.png"
          imageAlt="Stake to Earn"
          ctaName="Earn Rewards"
          ctaLink="/earn"
        />
        <FeatureSection
          title={
            <h2 className="text-2xl md:text-[33px] font-semibold mb-4 font-poppins">
              Earn{" "}
              <span className="bg-printer-orange-gradient text-gradient">
                XP
              </span>{" "}
              for{" "}
              <span className="bg-printer-orange-gradient text-gradient">
                rewards
              </span>
              !
            </h2>
          }
          description={
            <p className="text-[19px] text-[#b7b8bf] font-poppins">
              The more you trade, supply liquidity, or refer users, the more XP
              you earn and the more rewards{" "}
              <sup className="bg-printer-orange-gradient text-gradient text-xs">
                (and airdrops)
              </sup>{" "}
              you get!
            </p>
          }
          imageSrc="/img/home/earn-xp.png"
          imageAlt="Earn XP"
          reverse={true}
          ctaName="Earn XP"
          ctaLink="/airdrop"
        />
        <ScrollAnimation animateIn="fadeIn">
          <ProtocolStats />
        </ScrollAnimation>
      </div>
      <div className="px-8 md:px-16">
        <HomeFooter />
        <LowerFooter />
      </div>
    </div>
  );
};

export default Home;
