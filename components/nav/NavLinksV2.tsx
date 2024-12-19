import { headerLinks } from "@/config/header";
import React, { Fragment } from "react";
import NavLinkDropDown from "./NavLinkDropdown";

type Props = { className?: string };

const NavLinksV2 = ({ className }: Props) => {
  return (
    <div className={`gap-8 w-fit ${className ? className : "flex"}`}>
      {headerLinks.map((header, i) => (
        <Fragment key={i}>
          <NavLinkDropDown header={header.header} />
        </Fragment>
      ))}
    </div>
  );
};

export default NavLinksV2;
