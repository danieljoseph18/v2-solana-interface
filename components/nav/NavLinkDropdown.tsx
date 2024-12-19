import React, { useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image, { StaticImageData } from "next/image";

export type NavProps = {
  header: {
    title: string;
    link: string;
    redirect: boolean;
    subItems?: {
      title: string;
      link: string;
      redirect: boolean;
      label?: string;
      description?: string;
      icon?: StaticImageData;
    }[];
  };
};

function NavLinkDropDown({ header }: NavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return header.subItems ? (
    <Dropdown
      placement="bottom-start"
      onMouseLeave={() => {
        setIsOpen(false);
      }}
      onMouseEnter={() => {
        setIsOpen(true);
      }}
      isOpen={isOpen}
      classNames={{
        base: "bg-none",
        content: "bg-card-grad rounded-3 border-2 border-cardborder",
      }}
    >
      <DropdownTrigger
        onMouseLeave={() => {
          setIsOpen(false);
        }}
        onMouseEnter={() => {
          setIsOpen(true);
        }}
      >
        <div
          className={`flex gap-1 items-center ${
            pathname === header.link ||
            (header.subItems.length &&
              header.subItems.map((subitem) => subitem.link).includes(pathname))
              ? "text-white"
              : "text-printer-gray"
          } cursor-pointer `}
        >
          <Link
            href={header.link}
            target={header.redirect ? "_blank" : undefined}
            rel={header.redirect ? "noopener noreferrer" : undefined}
          >
            {header.title}
          </Link>
          {header.subItems.length ? (
            <BsChevronDown className="text-xl text-printer-orange translate-y-px" />
          ) : null}
        </div>
      </DropdownTrigger>
      {header.subItems.length ? (
        <DropdownMenu aria-label="Dynamic Actions" items={header.subItems}>
          {(item) => (
            <DropdownItem
              className={`${
                item.link === pathname
                  ? "text-white bg-gray-700"
                  : "text-gray-text hover:bg-gray-700"
              }`}
              key={item.title}
              href={item.link}
              target={item.redirect ? "_blank" : undefined}
              rel={item.redirect ? "noopener noreferrer" : undefined}
            >
              <div className="flex items-center">
                {item.icon && (
                  <Image
                    src={item.icon}
                    alt={item.title}
                    className="w-12 mr-2"
                    width={128}
                    height={128}
                  />
                )}
                <div className="flex flex-col text-lg">
                  <span className="text-white font-semibold">
                    {item.title.split(" ")[0]}{" "}
                    <span className="text-printer-orange">
                      {item.title.split(" ")[1]}
                    </span>
                  </span>
                  <span className="text-gray-400 text-sm">
                    {item.description}
                  </span>
                </div>
              </div>
            </DropdownItem>
          )}
        </DropdownMenu>
      ) : null}
    </Dropdown>
  ) : null;
}

export default NavLinkDropDown;
