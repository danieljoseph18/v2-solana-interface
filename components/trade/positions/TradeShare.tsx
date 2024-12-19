import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import TradeShareImage from "./TradeShareImage";
import ModalClose from "@/components/common/ModalClose";
import { getPriceDecimals } from "@/lib/web3/formatters";
import SpinningLoader from "@/components/common/SpinningLoader";
interface TradeShareProps {
  position: string;
  pnlPercentage: number;
  entryPrice: number;
  currentPrice: number;
  assetLogo: string;
  isLong: boolean;
  leverage: number;
  onClose: () => void;
  isClosed: boolean;
}

const TradeShare: React.FC<TradeShareProps> = (props) => {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [priceDecimals, setPriceDecimals] = useState<number>(7);
  const [uploadedImageInfo, setUploadedImageInfo] = useState<any | null>(null);
  const [uploadedImageError, setUploadedImageError] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasUploaded, setHasUploaded] = useState<boolean>(false);
  const [canvasReady, setCanvasReady] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const UPLOAD_SHARE =
    (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000") + "/api/s";
  const UPLOAD_URL =
    (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000") +
    "/api/upload-image";

  const getTwitterIntentURL = (
    text: string,
    url: string = "",
    hashtag: string = ""
  ) => {
    let finalURL = "https://twitter.com/intent/tweet?text=";
    if (text.length > 0) {
      finalURL += encodeURIComponent(text);
      if (hashtag.length > 0) {
        finalURL +=
          "&hashtags=" + encodeURIComponent(hashtag.replace(/#/g, ""));
      }
      if (url.length > 0) {
        finalURL += "&url=" + encodeURIComponent(url);
      }
    }
    return finalURL;
  };

  const getShareURL = (imageInfo: { id: string } | null) => {
    if (!imageInfo) return;
    let url = `${UPLOAD_SHARE}?id=${imageInfo.id}`;
    return url;
  };

  const shareToTwitter = () => {
    if (!uploadedImageInfo) return;

    const tweetText = `I'm trading ${props.position} with ${props.leverage}X leverage on @PRINT3Rxyz.

Trade anything, anywhere #onchain 👇`;
    const tweetLink = getTwitterIntentURL(
      tweetText,
      getShareURL(uploadedImageInfo)
    );

    window.open(tweetLink, "_blank", "noopener");
  };

  const handleUpload = async () => {
    if (hasUploaded) return; // Prevent multiple uploads
    setHasUploaded(true);
    setUploadedImageInfo(null);
    setUploadedImageError(null);
    setIsLoading(true);

    const canvas = canvasRef.current;
    if (!canvas) {
      setUploadedImageError("Canvas not available.");
      setIsLoading(false);
      return;
    }

    try {
      // Use html-to-image to generate JPEG data URL
      const dataUrl = canvas.toDataURL("image/png", 0.8);

      // Optionally, display a preview
      setShareUrl(dataUrl);

      // Upload to your backend or directly to Cloudinary
      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${errorData.error}`);
      }

      const imageInfo = await response.json();
      setUploadedImageInfo(imageInfo);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setUploadedImageError(
        error.message || "Image generation error, please try again."
      );
      setHasUploaded(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const randomVersion = Math.floor(Math.random() * 8) + 1;
    setPreviewImage(`/img/trade/trade-share-v${randomVersion}.png`);
  }, []);

  useEffect(() => {
    const decimals = getPriceDecimals(props.entryPrice);
    setPriceDecimals(decimals);
  }, [props.entryPrice, props.currentPrice]);

  useEffect(() => {
    if (canvasRef.current && previewImage) {
      setCanvasReady(true);
    }
  }, [previewImage]);

  return (
    <div className="flex flex-col items-center p-6 gap-4">
      <div className="flex flex-row items-center w-full justify-between">
        <p className="text-white font-bold">Share Trade</p>
        <ModalClose onClose={props.onClose} />
      </div>
      {shareUrl ? (
        <div className="w-full">
          <img
            src={shareUrl}
            alt="Trade Share"
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      ) : (
        <div className="flex flex-col w-full bg-card-grad border-cardborder border-3 relative">
          <div className={`${isLoading ? "absolute block" : "hidden"}`}>
            <SpinningLoader />
          </div>
          <img
            src={previewImage}
            className="w-full min-h-[200px]"
            alt="Preview"
          />
          <div className="flex flex-col gap-1 md:gap-2 absolute top-[75px] left-5 w-[40%]">
            <div className="flex flex-row items-center gap-5">
              <div className="flex gap-1 items-center">
                <Image
                  src={props.assetLogo}
                  alt={props.position}
                  width={20}
                  height={20}
                  className="rounded-full w-5 h-5"
                />
                <p className="text-white font-bold md:text-base text-sm">
                  {props.position}
                </p>
              </div>
            </div>
            <p
              className={`uppercase font-semibold md:text-xs text-[10px] ${
                props.isLong ? "text-printer-green" : "text-printer-red"
              }`}
            >{`${props.isLong ? "Long" : "Short"} ${props.leverage}x`}</p>
            <p
              className={`font-bold md:text-4xl text-lg ${
                props.pnlPercentage > 0
                  ? "text-printer-green"
                  : "text-printer-red"
              }`}
            >{`${props.pnlPercentage > 0 ? "+" : ""}${
              props.pnlPercentage
            }%`}</p>
            <div className="flex flex-row items-center justify-between w-full">
              <p className="text-printer-gray md:text-xs text-[10px]">
                Entry Price
              </p>
              <p className="text-printer-orange md:text-xs text-[10px] font-semibold">{`$${props.entryPrice.toFixed(
                priceDecimals
              )}`}</p>
            </div>
            <div className="flex flex-row items-center justify-between w-full">
              <p className="text-printer-gray md:text-xs text-[10px]">
                {props.isClosed ? "Exit Price" : "Current Price"}
              </p>
              <p className="text-printer-orange md:text-xs text-[10px] font-semibold">{`$${props.currentPrice.toFixed(
                priceDecimals
              )}`}</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "none" }}>
        <TradeShareImage
          ref={canvasRef}
          {...props}
          backgroundImage={previewImage}
        />
      </div>

      <div className="mt-6 space-x-4">
        <Button
          onPress={handleUpload}
          disabled={!canvasReady || isLoading}
          className="text-white px-2 cursor-pointer bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 font-bold"
        >
          Generate Image
        </Button>
        <Button
          onPress={shareToTwitter}
          disabled={!shareUrl || isLoading}
          className={`text-white px-2 ${
            !shareUrl || isLoading
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          } bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 font-bold`}
        >
          Share to Twitter
        </Button>
      </div>
      {isLoading && <SpinningLoader />}
      {uploadedImageError && (
        <p className="text-red-500 mt-2">{uploadedImageError}</p>
      )}
    </div>
  );
};

export default TradeShare;
