import { Button } from "@nextui-org/react";
import Image from "next/image";
import { MdArrowOutward } from "react-icons/md";
import PrinterLogo from "@/app/assets/nav/nav-logo.png";

const EarnHero = ({
  mainTitle,
  subTitle,
  secondTitle,
  secondSubTitle,
  docLink,
}: {
  mainTitle: string;
  subTitle: string;
  secondTitle: string;
  secondSubTitle: string;
  docLink: string;
}) => {
  return (
    <div className="w-full flex flex-col gap-4 p-6">
      {/* Main Hero */}
      <div className="flex w-full justify-between p-4 bg-card-grad border border-cardborder rounded-7">
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          <p className="font-bold text-xl text-white">{mainTitle}</p>
          <p className="text-13 text-gray-text">{subTitle}</p>
        </div>
        <Image
          src={PrinterLogo}
          alt="Earn Hero"
          className="hidden md:block w-[186px] h-[24px]"
          width={200}
          height={200}
        />
      </div>

      {/* Learn More */}
      <div className="flex flex-col md:flex-row w-full justify-between p-4 gap-2 bg-card-grad border border-cardborder rounded-7">
        <div className="flex flex-col gap-4 w-full md:w-2/3">
          <p className="font-bold text-base text-white">{secondTitle}</p>
          <p className="text-gray-text text-xs">{secondSubTitle}</p>
        </div>

        <Button href={docLink} className="w-full md:w-auto h-full">
          {" "}
          <div className="flex w-full h-full md:w-auto items-center justify-center gap-2">
            <p>Read our Docs</p>
            <MdArrowOutward className="text-xl" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default EarnHero;
