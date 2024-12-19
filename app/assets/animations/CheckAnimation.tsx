import React from "react";
import Lottie from "lottie-react";
import animationData from "./check-animation.json";

const CheckAnimation = () => {
  return (
    <div style={{ width: "200px", height: "200px" }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default CheckAnimation;
