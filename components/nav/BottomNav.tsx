"use client";

import React from "react";
import BottomNavLinks from "@/components/nav/BottomNavLinks";

const BottomNav = () => {
  return (
    <div className="z-[100] fixed bottom-0 left-0 right-0 flex gap-2 justify-around md:hidden bg-menu p-4">
      <BottomNavLinks />
    </div>
  );
};

export default BottomNav;
