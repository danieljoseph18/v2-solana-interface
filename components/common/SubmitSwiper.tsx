import React, { useState, useRef, useEffect } from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

interface SubmitSwiperProps {
  onSuccess: () => void;
  text: string;
  disabled?: boolean;
}

const SubmitSwiper: React.FC<SubmitSwiperProps> = ({
  onSuccess,
  text,
  disabled = false,
}) => {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (disabled) return;

    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX - position;
  };

  const handleTouchMove = (e: TouchEvent | MouseEvent) => {
    if (!isDragging || disabled) return;

    const clientX =
      "touches" in e
        ? (e as TouchEvent).touches[0].clientX
        : (e as MouseEvent).clientX;
    const track = trackRef.current;
    const thumb = thumbRef.current;

    if (track && thumb) {
      const trackRect = track.getBoundingClientRect();
      const maxPosition = trackRect.width - thumb.offsetWidth;
      const newPosition = Math.max(
        0,
        Math.min(maxPosition, clientX - startXRef.current)
      );
      setPosition(newPosition);

      // If reached the end, trigger success
      if (newPosition >= maxPosition * 0.95) {
        setIsDragging(false);
        setPosition(maxPosition); // Set to max before resetting
        setTimeout(() => {
          setPosition(0);
          onSuccess();
        }, 200);
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging || disabled) return;

    setIsDragging(false);
    setPosition(0);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("mousemove", handleTouchMove);
      window.addEventListener("touchend", handleTouchEnd);
      window.addEventListener("mouseup", handleTouchEnd);

      return () => {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("mousemove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("mouseup", handleTouchEnd);
      };
    }
  }, [isDragging]);

  const getFillWidth = () => {
    if (!thumbRef.current) return 0;
    return position + thumbRef.current.offsetWidth;
  };

  return (
    <div className="w-full bg-text-grad p-0.5 rounded-full">
      <div
        ref={trackRef}
        className={`relative h-16 rounded-full bg-input-grad backdrop-blur-md overflow-hidden
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {/* Progress fill - now positioned behind thumb */}
        <div
          className="absolute inset-y-0 left-0 bg-button-grad rounded-full"
          style={{ width: `${getFillWidth()}px` }}
        />

        {/* Track with text */}
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-base">
          {text}
        </div>

        {/* Thumb */}
        <div
          ref={thumbRef}
          onTouchStart={handleTouchStart}
          onMouseDown={handleTouchStart}
          style={{
            transform: `translateX(${position}px)`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
          }}
          className={`absolute left-0 h-full w-[100px] rounded-full 
          bg-button-grad
          flex items-center justify-center cursor-grab active:cursor-grabbing border-2 border-printer-orange
          ${disabled ? "cursor-not-allowed" : ""}`}
        >
          <MdKeyboardDoubleArrowRight className="text-6xl text-white" />
        </div>
      </div>
    </div>
  );
};

export default SubmitSwiper;
