"use client";
import React from "react";
import ScrollAnimation from "react-animate-on-scroll";
import HomeHero from "@/components/home/HomeHero";
import FeatureSection from "@/components/home/FeatureSection";
import ProtocolStats from "@/components/home/ProtocolStats";
import HomeFooter from "@/components/home/HomeFooter";
import "animate.css/animate.compat.css";
import LowerFooter from "@/components/home/LowerFooter";
import FirstMover from "@/app/assets/home/first-mover.png";
import MarketMaking from "@/app/assets/home/market-making.png";
import RevenueSharing from "@/app/assets/home/revenue-sharing.png";
import SummarySection from "@/components/home/SummarySection";

const Home = () => {
  return (
    <div className="bg-home-card-grad text-white relative font-poppins">
      <HomeHero />
      <SummarySection />
      <div className="px-6 md:px-8 lg:px-16 xl:px-52">
        <FeatureSection
          title={
            <h2 className="text-2xl md:text-[33px] font-semibold mb-4">
              Trade the markets YOU want to trade before anyone else!
            </h2>
          }
          description={
            <p className="text-[19px] text-home-gray">
              Long or short any Web3 asset on any chain, with chain agnostic
              markets - no bridging ever needed.
            </p>
          }
          imageSrc={FirstMover.src}
          imageAlt="First Mover"
          reverse={true}
          ctaName="Trade Now"
          ctaLink="/trade"
        />
        <FeatureSection
          title={
            <h2 className="text-2xl md:text-[33px] font-semibold mb-4">
              Become a Market Maker & Earn Trading Fees
            </h2>
          }
          description={
            <p className="text-[19px] text-home-gray">
              Stake SOL or USDC in the PRINT3R earning vaults to mint LP tokens
              and start earning 50% of ALL trading fees!
            </p>
          }
          imageSrc={MarketMaking.src}
          imageAlt="Market Making"
          ctaName="Earn Rewards"
          ctaLink="/earn"
        />
        <FeatureSection
          title={
            <h2 className="text-2xl md:text-[33px] font-semibold mb-4">
              Bonus Protocol Revenue for All DAO Members.
            </h2>
          }
          description={
            <p className="text-[19px] text-home-gray">
              Join our community on DAOs.fun to enjoy exclusive holder benefits
              and bonus revenue sharing.
            </p>
          }
          imageSrc={RevenueSharing.src}
          imageAlt="Bonus Protocol Revenue"
          reverse={true}
          ctaName="Join DAOs.fun"
          ctaLink="/earn"
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
