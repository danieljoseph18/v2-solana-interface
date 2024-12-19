import React from "react";

const HorizontalDivider = ({ dividerColour }: { dividerColour: string }) => {
  return <div className={`bg-${dividerColour} h-px w-full min-w-12`}></div>;
};

export default HorizontalDivider;
