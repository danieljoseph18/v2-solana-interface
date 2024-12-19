import Link from "next/link";
import React from "react";
import SvgIcon from "@/components/common/SvgIcon";
import BottomDropdown from "@/components/nav/BottomDropdown";
import { usePathname } from "next/navigation";

interface BottomNavLinkProps extends BottomNavProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const BottomNavLink: React.FC<BottomNavLinkProps> = ({
  path,
  svgContent,
  label,
  options,
  isOpen,
  onToggle,
}) => {
  const pathname = usePathname();
  const isActive =
    pathname === path ||
    (options && options.some((option) => pathname.startsWith(option.href)));

  return (
    <div className="flex flex-col items-center relative">
      <div
        onClick={onToggle}
        className="flex flex-col items-center gap-1 group cursor-pointer"
      >
        <Link href={path} className="flex flex-col items-center gap-1 group">
          <SvgIcon
            svgContent={svgContent}
            className={`fill-current ${
              isActive ? "text-printer-orange" : "text-printer-gray"
            } group-hover:text-printer-orange group-focus:text-printer-orange `}
          />
          {label && (
            <span
              className={`text-xxs text-center ${
                isActive ? "text-printer-orange" : "text-printer-gray"
              } group-hover:text-printer-orange group-focus:text-printer-orange`}
            >
              {label}
            </span>
          )}
        </Link>
      </div>
      {isOpen && options!.length > 0 && <BottomDropdown options={options} />}
    </div>
  );
};

export default BottomNavLink;
