"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface BottomNavContextType {
  isVisible: boolean;
  toggleVisibility: () => void;
}

const BottomNavContext = createContext<BottomNavContextType | undefined>(
  undefined
);

export const BottomNavProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <BottomNavContext.Provider value={{ isVisible, toggleVisibility }}>
      {children}
    </BottomNavContext.Provider>
  );
};

export const useBottomNav = () => {
  const context = useContext(BottomNavContext);
  if (context === undefined) {
    throw new Error("useBottomNav must be used within a BottomNavProvider");
  }
  return context;
};
