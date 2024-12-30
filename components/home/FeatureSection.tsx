"use client";

import React, { useState } from "react";
import Image from "next/image";
import ScrollAnimation from "react-animate-on-scroll";
import { FaExternalLinkAlt } from "react-icons/fa";
import LaunchAppModal from "./LaunchAppModal";

interface FeatureSectionProps {
  title: React.ReactNode;
  description: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  ctaName: string;
  ctaLink: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  reverse = false,
  ctaName,
  ctaLink,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <ScrollAnimation animateIn="fadeIn">
      <div
        className={`flex flex-col-reverse md:flex-row ${
          reverse ? "md:flex-row-reverse" : ""
        } items-center py-16 justify-between w-full gap-8`}
      >
        <div className="w-full md:w-1/2 2xl:w-1/3 mt-8 md:mb-0">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={1500}
            height={500}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-1/2 md:max-w-[460px]">
          <div>{title}</div>
          <div className="text-pretty">{description}</div>
          <div
            className="text-base font-semibold flex flex-row items-center gap-2 md:gap-4 text-printer-orange hover:text-printer-dark-orange cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <p className="text-nowrap">{ctaName}</p>
            <FaExternalLinkAlt className="text-base" />
          </div>
        </div>
      </div>
      <LaunchAppModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        selectedPath={ctaLink}
      />
    </ScrollAnimation>
  );
};

export default FeatureSection;
