import React, { useState, useCallback } from "react";
import { Tooltip } from "@nextui-org/react";

const CustomTooltip = ({
  content,
  children,
  containerPadding,
  placement,
  key,
  isDisabled,
  maxWidth,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  containerPadding?: number;
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-start"
    | "top-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end"
    | "right-start"
    | "right-end";
  key?: number;
  isDisabled?: boolean;
  maxWidth?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleTouch = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      setIsVisible(!isVisible);
    },
    [isVisible]
  );

  return (
    <Tooltip
      isDisabled={isDisabled}
      content={content}
      isOpen={isVisible}
      onOpenChange={(open) => setIsVisible(open)}
      containerPadding={containerPadding}
      placement={placement}
      classNames={{
        base: "py-2 px-4 shadow-xl rounded-3",
        content: `bg-card-grad border-cardborder border-2 text-white text-sm break-words ${
          maxWidth ? `max-w-[${maxWidth}px]` : "max-w-[350px]"
        }`,
      }}
      key={key}
    >
      <div
        onTouchStart={handleTouch}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default CustomTooltip;
