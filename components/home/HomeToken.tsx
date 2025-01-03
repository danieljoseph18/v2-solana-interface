import Image, { StaticImageData } from "next/image";
import React from "react";

const HomeToken = ({
  token,
  size,
  top,
  left,
}: {
  token: StaticImageData;
  size: number;
  top?: number;
  left?: number;
}) => {
  const blurredSize = size + 8 + "px";

  // Use deterministic values based on size if top/left not provided
  const defaultTop = ((size % 90) / 90) * 100;
  const defaultLeft = (((size * 2) % 90) / 90) * 100;

  const positionStyle: React.CSSProperties = {
    position: "absolute",
    top: `${(top !== undefined ? top * 100 : defaultTop).toFixed(0)}%`,
    left: `${(left !== undefined ? left * 100 : defaultLeft).toFixed(0)}%`,
    animation: `float ${3 + (size % 2)}s ease-in-out infinite`,
  };

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const blurredStyle: React.CSSProperties = {
    width: blurredSize,
    height: blurredSize,
    borderRadius: "50%",
    filter: "blur(10px)",
    zIndex: 0,
  };

  const iconStyle: React.CSSProperties = {
    width: size,
    height: size,
    zIndex: 1,
  };

  return (
    <div style={{ ...containerStyle, ...positionStyle }}>
      <Image
        src={token}
        alt="Token Logo"
        style={blurredStyle}
        className="absolute"
        width={128}
        height={128}
      />
      <Image
        src={token}
        alt="Token Logo"
        style={iconStyle}
        className="relative"
        width={128}
        height={128}
      />
    </div>
  );
};

export default HomeToken;
