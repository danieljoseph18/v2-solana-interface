import Image from "next/image";
import React from "react";
import ScrollAnimation from "react-animate-on-scroll";
import Handshake from "@/app/assets/home/handshake-icon.png";
import Seamless from "@/app/assets/home/seamless-icon.png";
import Fire from "@/app/assets/home/fire-icon.png";
import First from "@/app/assets/home/first-icon.png";
import TradingUiScreenshot from "@/app/assets/home/trading-ui-screenshot.png";

const SummaryCard = ({
  image,
  title,
  description,
  imageClasses,
}: {
  image: string;
  imageClasses?: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex gap-8 items-center justify-center w-full">
      <Image
        src={image}
        alt={title}
        width={100}
        height={50}
        className={` ${imageClasses}`}
      />
      <div className="flex flex-col gap-2">
        <h3 className="text-white text-lg font-semibold">{title}</h3>
        <p className="text-white text-xs max-w-[250px]">{description}</p>
      </div>
    </div>
  );
};

const SummarySection = () => {
  return (
    <ScrollAnimation animateIn="fadeIn">
      <div className="flex flex-col pt-16 pb-8">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-white text-3xl font-semibold">
            The{" "}
            <span className="bg-printer-orange-gradient text-transparent bg-clip-text decoration-printer-orange underline decoration-2">
              First
            </span>{" "}
            Decentralized Futures <br /> Markets for Daos.Fun Launches
          </h2>
          <Image
            src={TradingUiScreenshot}
            alt="Trading UI Screenshot"
            width={300}
            height={200}
            className="md:hidden"
          />
        </div>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 py-8 w-full items-center bg-transparent px-6 md:px-8 lg:px-16 xl:px-52 relative border-y-2 border-y-cardborder md:border-y-0">
          <div className="md:hidden absolute inset-0 bg-summary-section-radial opacity-80" />
          <div className="relative z-10">
            <SummaryCard
              image={Handshake.src}
              imageClasses="w-16 h-14"
              title="Low Fees"
              description="Enjoy on-chain trading of the hottest DAO launches on Solana without breaking the bank."
            />
          </div>
          <div className="h-[1px] bg-white/20 md:hidden my-4 relative z-10 !min-w-full" />
          <div className="relative z-10">
            <SummaryCard
              image={Seamless.src}
              imageClasses="w-14 h-14"
              title="Seamless Experience"
              description="Advanced account abstraction to enable one-click trading. Stay locked in without any wallet approvals interrupting your flow."
            />
          </div>
          <div className="h-[1px] bg-white/20 md:hidden my-4 relative z-10 !min-w-full" />
          <div className="relative z-10">
            <SummaryCard
              image={Fire.src}
              imageClasses="w-14 h-16"
              title="Up to 50x Leverage"
              description="Trade everything blazingly fast with up to 50X leverage at your fingertips."
            />
          </div>
          <div className="h-[1px] bg-white/20 md:hidden my-4 relative z-10 !min-w-full" />
          <div className="relative z-10">
            <SummaryCard
              image={First.src}
              imageClasses="w-14 h-16"
              title="First Mover Advantage"
              description="Trade the assets for the hottest launches on Solana before anyone else."
            />
          </div>
        </div>
      </div>
    </ScrollAnimation>
  );
};

export default SummarySection;
