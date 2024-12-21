"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import styles from "./WalletSwiper.module.css";

const onboardingSlides = [
  {
    title:
      "Welcome to the PRINT3R Wallet, create yours to start trading and earning.",
    image: "/img/wallet/welcome-wallets.png",
    description: "Come back and use PRINT3R each day to multiply your rewards",
    alt: "PRINT3R Wallet illustration",
  },
  {
    title:
      "The PRINT3R Wallet lets you trade any token, on any chain up to 1000X.",
    image: "/img/common/money-goblin.png",
    description: "Come back and use PRINT3R each day to multiply your rewards",
    alt: "Trading illustration",
  },
  {
    title:
      "Easily top up your balance with crypto, all major cards & providers.",
    image: "/img/wallet/apple-google-pay.png",
    description: "Come back and use PRINT3R each day to multiply your rewards",
    alt: "Top up illustration",
  },
  {
    title: "No Seed? No problem. Just create an account to start trading!",
    image: "/img/wallet/booty-goblin.png",
    description: "Come back and use PRINT3R each day to multiply your rewards",
    alt: "Account creation illustration",
  },
];

interface WalletSwiperProps {
  onLastSlideReached: (isLastSlide: boolean) => void;
}

const WalletSwiper = ({ onLastSlideReached }: WalletSwiperProps) => {
  const handleSlideChange = (swiper: any) => {
    const isLastSlide = swiper.isEnd;
    onLastSlideReached(isLastSlide);
  };

  return (
    <div className="flex justify-center w-full h-full max-w-full overflow-x-hidden py-8">
      <Swiper
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className={`${styles.swiper} h-[600px] w-full`}
        onSlideChange={handleSlideChange}
      >
        {onboardingSlides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="flex flex-col items-center justify-center p-4"
          >
            <div className="flex flex-col items-center justify-center p-4">
              <Image
                src={slide.image}
                alt={slide.alt}
                className="mb-4 rounded-lg"
                width={370}
                height={370}
              />
              <h2 className="text-2xl font-medium text-center mb-4">
                {slide.title}
              </h2>
              <p className="text-center text-15 text-gray-text font-medium">
                {slide.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default WalletSwiper;
