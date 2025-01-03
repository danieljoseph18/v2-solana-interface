import React from "react";
import Link from "next/link";
import Image from "next/image";

type BottomDropdownProps = {
  options: BottomNavProps["options"];
};

const BottomDropdown: React.FC<BottomDropdownProps> = ({ options = [] }) => {
  return (
    <div
      className={
        "fixed left-0 bottom-16 w-full bg-card-grad !rounded-3 border-2 border-cardborder text-white py-2 shadow-lg z-50 pointer-events-auto flex flex-col"
      }
    >
      {options.map((option) => (
        <div key={option.href} className="block hover:bg-gray-700">
          <Link href={option.href} className="flex items-center p-2">
            {option.icon && (
              <Image
                src={option.icon}
                alt={option.label}
                className="w-12 mr-2"
                width={128}
                height={128}
              />
            )}
            <div className="flex flex-col text-xl">
              <span className="text-white font-bold">
                {option.label.split(" ")[0]}{" "}
                <span className="text-printer-orange">
                  {option.label.split(" ")[1]}
                </span>
              </span>
              <span className="text-gray-400 text-base">
                {option.description}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BottomDropdown;
