import React from "react";
import Lottie from "lottie-react";
import animationData from "./fail-animation.json";

const FailAnimation = () => {
  return (
    <div style={{ width: "200px", height: "150px" }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
  );
};

export default FailAnimation;
