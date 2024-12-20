"use client";

import React, { useState, useEffect, useMemo, JSX } from "react";
import { FaArrowDown } from "react-icons/fa";
import DummyEllipse from "@/app/assets/home/dummy-box-ellipse.png";
import Image from "next/image";
import FlyingTokens from "@/components/home/FlyingTokens";
import "animate.css";
import HomeHeaderMask from "@/app/assets/home/home-header.png";
import { Button } from "@nextui-org/react";
import LaunchAppModal from "@/components/home/LaunchAppModal";

const Typewriter = ({ speed = 150 }: { speed?: number }) => {
  const fullText = useMemo(
    () => [
      "Trade ",
      <span key="1" className="bg-printer-orange-gradient text-gradient">
        anything,
      </span>,
      <br key="2" />,
      " on ",
      <span key="3" className="bg-printer-orange-gradient text-gradient">
        any{" "}
      </span>,
      "Chain ",
      <br key="4" />,
      " up to ",
      <span key="5" className="bg-printer-orange-gradient text-gradient">
        1000x
      </span>,
    ],
    []
  );

  const [displayedChars, setDisplayedChars] = useState<
    Array<string | JSX.Element>
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (isTyping && currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedChars((prev) => [...prev, fullText[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (currentIndex >= fullText.length) {
      setIsTyping(false);
    }
  }, [currentIndex, fullText, speed, isTyping]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500); // Blink every 500ms
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span>
      {displayedChars}
      <span
        className={`typewriter-cursor bg-printer-orange-gradient text-gradient ${
          showCursor ? "opacity-100" : "opacity-0"
        }`}
      >
        {" "}
        |
      </span>
    </span>
  );
};

const HomeHero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="py-8 md:py-20 w-full relative border-b border-b-divider font-poppins">
      <Image
        src={HomeHeaderMask}
        alt="Home header mask"
        width={396}
        height={396}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
      <FlyingTokens />
      <div className="flex flex-col items-center justify-center w-full mb-10 gap-2">
        <p className="text-sm text-white">The world&apos;s first</p>
        <div className="px-6 py-2 bg-card-grad border-cardborder border-2 rounded-full text-sm text-[#E5E6ED] font-medium">
          Permissionless Trading App
        </div>
      </div>

      <p className="text-white font-semibold text-3xl md:text-5xl text-center !z-[2] relative animate__animated animate__fadeIn min-h-[6rem] md:min-h-[12.5rem]">
        <Typewriter speed={150} />
      </p>

      <div className="relative py-5 lg:px-36 mx-auto w-fit animate__animated animate__fadeIn">
        <div className="hidden absolute w-full h-full top-0 bottom-0 right-0 left-0">
          <Image
            alt=""
            src={DummyEllipse}
            className="w-full h-full object-cover"
            width={128}
            height={128}
          />
        </div>
      </div>

      <div className="flex items-center justify-center w-full">
        <Button
          className="bg-p3-button hover:bg-p3-button-hover border-2 border-p3-border !rounded-3 text-base text-white font-semibold font-poppins px-3 py-2 min-w-[200px]"
          onPress={() => setIsModalOpen(true)}
        >
          Trade Now
        </Button>
      </div>

      <div className="flex justify-center items-center w-full">
        <p className="px-20 mt-8 font-normal text-xs md:text-lg text-[#E5E6ED] max-w-[540px] text-center !z-[2] relative animate__animated animate__fadeIn">
          The first permissionless leverage markets where you can long or short
          anything, up to 1000x on Base & 190+ other chains.
        </p>
      </div>

      <div className="flex mt-8 justify-center items-center gap-2 text-white font-bold text-lg relative z-[2] animate__animated animate__fadeIn">
        <p>Scroll to learn more</p>
        <FaArrowDown className="subtle-float-2 mt-3" />
      </div>

      <style jsx>{`
        .typewriter-cursor {
          display: inline-block;
          margin-left: 2px;
          width: 10px;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @media (min-width: 768px) {
          p.text-center {
            min-height: 4.5rem; /* Adjust as needed for larger screens */
          }
        }
      `}</style>
      <LaunchAppModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        selectedPath="/trade"
      />
    </div>
  );
};

export default HomeHero;
