import React, { useEffect, forwardRef, ForwardedRef } from "react";

interface TradeShareImageProps {
  position: string;
  pnlPercentage: number;
  entryPrice: number;
  currentPrice: number;
  assetLogo: string;
  isLong: boolean;
  leverage: number;
  backgroundImage: string;
}

const TradeShareImage = forwardRef<HTMLCanvasElement, TradeShareImageProps>(
  (props, ref: ForwardedRef<HTMLCanvasElement>) => {
    useEffect(() => {
      const canvas = (ref as React.RefObject<HTMLCanvasElement>).current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const drawImage = () => {
        const baseImage = new Image();
        baseImage.crossOrigin = "anonymous";
        baseImage.src = props.backgroundImage;

        baseImage.onload = () => {
          const scaleFactor = 0.25; // Adjust this value to change the overall size
          const originalWidth = 4197;
          const originalHeight = 2187;

          canvas.width = originalWidth * scaleFactor;
          canvas.height = originalHeight * scaleFactor;
          ctx.scale(scaleFactor, scaleFactor);

          ctx.drawImage(baseImage, 0, 0, originalWidth, originalHeight);

          // Use a fallback font instead of loading Inter
          const fallbackFont = "Arial, sans-serif";

          // Position
          const positionY = 921;
          ctx.font = `bold 120px ${fallbackFont}`;
          ctx.fillStyle = "white";
          ctx.fillText(props.position, 375, positionY);

          // Leverage on a new row
          ctx.fillStyle = props.isLong ? "#30E0A1" : "#FA2256";
          ctx.font = `bold 90px ${fallbackFont}`;
          ctx.fillText(
            `${props.isLong ? "LONG" : "SHORT"} ${props.leverage}x`,
            175, // Same X position as the position text
            1100 // Y position moved down by 140px (adjust as needed)
          );

          // PNL percentage
          ctx.font = `bold 320px ${fallbackFont}`;
          ctx.fillStyle =
            Number(props.pnlPercentage) > 0 ? "#30E0A1" : "#FA2256";
          ctx.fillText(
            `${Number(props.pnlPercentage) > 0 ? "+" : ""}${
              props.pnlPercentage
            }%`,
            175,
            1443 // Moved down by 140px to accommodate the new row
          );

          // Entry and Current prices
          ctx.font = `90px ${fallbackFont}`;
          ctx.fillStyle = "#CACACA";
          ctx.fillText("Entry Price", 175, 1627); // Moved down by 140px
          ctx.fillText("Current Price", 175, 1780); // Moved down by 140px

          ctx.font = `bold 90px ${fallbackFont}`;
          ctx.fillStyle = "#F05722";
          ctx.fillText(`$${props.entryPrice}`, 1000, 1627); // Moved down by 140px
          ctx.fillText(`$${props.currentPrice}`, 1000, 1780); // Moved down by 140px

          // Asset logo
          const logoImage = new Image();
          logoImage.crossOrigin = "anonymous";
          logoImage.src = props.assetLogo;
          logoImage.onload = () => {
            const logoSize = 120;
            const logoX = 175;
            const logoY = 821;

            ctx.save(); // Save the current context state
            ctx.beginPath();
            ctx.arc(
              logoX + logoSize / 2,
              logoY + logoSize / 2,
              logoSize / 2,
              0,
              Math.PI * 2
            );
            ctx.closePath();
            ctx.clip(); // Create a circular clipping region

            ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
            ctx.restore(); // Restore the context state (removes clipping)
          };
        };

        baseImage.onerror = (err) => {
          console.error("Failed to load background image:", err);
        };
      };

      drawImage();
    }, [props, ref]);

    return <canvas ref={ref} />;
  }
);

TradeShareImage.displayName = "TradeShareImage";

export default TradeShareImage;
