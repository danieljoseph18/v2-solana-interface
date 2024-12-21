import React from "react";
import Image, { StaticImageData } from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import styles from "./DashboardSwiper.module.css";
import GooglePay from "@/app/assets/wallet/google-pay.png";

interface SlideProps {
  title: string;
  description: string;
  image: StaticImageData;
  altText: string;
}

const Slide: React.FC<SlideProps> = ({
  title,
  description,
  image,
  altText,
}) => (
  <div className="flex items-center justify-between gap-6 p-6 h-full w-full">
    <div>
      <p className="font-medium text-white text-base">{title}</p>
      <p className="text-base font-medium text-dashboard-gray">{description}</p>
    </div>
    <Image src={image} alt={altText} width={63} height={40} />
  </div>
);

const DashboardSwiper = () => {
  const slides: SlideProps[] = [
    {
      title: "Top Up Your Wallet for free",
      description: "No-fee balance top up with Google Pay Transfers",
      image: GooglePay,
      altText: "Google Pay",
    },
    {
      title: "Apple Pay Integration",
      description: "Seamless transactions with Apple Pay",
      image: GooglePay,
      altText: "Apple Pay",
    },
    {
      title: "Bank Transfer Option",
      description: "Direct transfers from your bank account",
      image: GooglePay,
      altText: "Bank Transfer",
    },
  ];

  return (
    <Swiper
      modules={[Pagination, EffectFade]}
      spaceBetween={50}
      slidesPerView={1}
      pagination={{ clickable: true }}
      className={`${styles.swiper} h-full w-full`}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index} className="h-full w-full">
          <Slide {...slide} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default DashboardSwiper;
