import { LongArrow, ShortArrow } from "@/config/svgs";
import SvgIcon from "@/components/common/SvgIcon";
import { Button } from "@nextui-org/react";

type EntryButtonsProps = {
  positiveText: string;
  negativeText: string;
  title: string;
  isPositive: boolean;
  setIsPositive: (value: boolean) => void;
  mobileVariant?: boolean;
  onClick?: () => void;
  showIcons?: boolean;
};

const EntryButtons = ({
  positiveText,
  negativeText,
  title,
  isPositive,
  setIsPositive,
  mobileVariant = false,
  onClick,
  showIcons = true,
}: EntryButtonsProps) => {
  const getButtonClass = (direction: string) => {
    return isPositive === (direction === "up")
      ? direction === "up"
        ? "lg:bg-green-grad text-white"
        : "lg:bg-red-grad text-white"
      : "text-white lg:bg-card-grad";
  };

  return (
    <div
      className={
        mobileVariant
          ? "p-4 fixed bottom-[4.6rem] md:bottom-[7.3rem] z-50 w-full bg-card-grad border-t border-t-cardborder"
          : ""
      }
    >
      <div
        className={`text-gray-text font-bold text-sm mb-2 ${
          mobileVariant ? "text-center" : ""
        }`}
      >
        {title}
      </div>
      <div className="flex w-full gap-2 border-cardborder rounded-7 max-w-full">
        <Button
          className={`flex flex-row items-center justify-center gap-2 w-[50%] px-4 py-3 rounded font-bold text-base bg-green-grad text-white border border-cardborder  ${getButtonClass(
            "up"
          )}`}
          onPress={() => {
            setIsPositive(true);
            onClick && onClick();
          }}
        >
          {positiveText}
          {showIcons && (
            <SvgIcon
              svgContent={LongArrow}
              className={`fill-current text-white`}
            />
          )}
        </Button>
        <Button
          className={`flex flex-row items-center justify-center gap-2 w-[50%] px-4 py-3 rounded font-bold text-base bg-red-grad text-white border border-cardborder ${getButtonClass(
            "down"
          )}`}
          onPress={() => {
            setIsPositive(false);
            onClick && onClick();
          }}
        >
          {negativeText}
          {showIcons && (
            <SvgIcon
              svgContent={ShortArrow}
              className={`fill-current text-white`}
            />
          )}
        </Button>
      </div>
    </div>
  );
};

export default EntryButtons;
