import React from "react";
import Lottie from "lottie-react";
import animationData from "./loading-animation.json";

const LoadingAnimation = () => {
  return (
    <div style={{ width: "200px", height: "200px" }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default LoadingAnimation;
