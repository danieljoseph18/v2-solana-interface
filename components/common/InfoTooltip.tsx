import React from "react";
import CustomTooltip from "./CustomTooltip";

const InfoTooltip = ({
  text,
  content,
}: {
  text: string;
  content: React.ReactNode;
}) => {
  return (
    <CustomTooltip content={text} placement="top">
      <div className="cursor-help">{content}</div>
    </CustomTooltip>
  );
};

export default InfoTooltip;
