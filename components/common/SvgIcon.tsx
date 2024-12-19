import React from "react";

type SvgProps = {
  svgContent: string;
  className?: string;
};

const SvgIcon: React.FC<SvgProps> = ({ svgContent, className }) => {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default SvgIcon;
