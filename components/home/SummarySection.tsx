import Image from "next/image";
import React from "react";
import ScrollAnimation from "react-animate-on-scroll";
import Handshake from "@/app/assets/home/handshake-icon.png";
import Seamless from "@/app/assets/home/seamless-icon.png";
import Fire from "@/app/assets/home/fire-icon.png";
import First from "@/app/assets/home/first-icon.png";

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
      <div className="flex flex-col gap-8 py-32 items-center bg-home-card-grad md:bg-transparent px-6 md:px-8 lg:px-16 xl:px-52">
        <h2 className="text-white text-3xl font-semibold">
          The First Decentralized Futures <br /> Markets for Daos.Fun Launches
        </h2>
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 w-full">
          <SummaryCard
            image={Handshake.src}
            imageClasses="w-16 h-14"
            title="Low Fees"
            description="Enjoy on-chain trading of the hottest DAO launches on Solana without breaking the bank."
          />
          <div className="h-[1px] bg-white/20 md:hidden my-4" />
          <SummaryCard
            image={Seamless.src}
            imageClasses="w-14 h-14"
            title="Seamless Experience"
            description="Advanced account abstraction to enable one-click trading. Stay locked in without any wallet approvals interrupting your flow."
          />
          <div className="h-[1px] bg-white/20 md:hidden my-4" />
          <SummaryCard
            image={Fire.src}
            imageClasses="w-14 h-16"
            title="Up to 50x Leverage"
            description="Trade everything blazingly fast with up to 50X leverage at your fingertips."
          />
          <div className="h-[1px] bg-white/20 md:hidden my-4" />
          <SummaryCard
            image={First.src}
            imageClasses="w-14 h-16"
            title="First Mover Advantage"
            description="Trade the assets for the hottest launches on Solana before anyone else."
          />
        </div>
      </div>
    </ScrollAnimation>
  );
};

export default SummarySection;
