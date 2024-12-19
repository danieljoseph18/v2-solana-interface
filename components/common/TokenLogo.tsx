import Image from "next/image";
import { getImageUrlfromTokenSymbol } from "@/lib/utils/getTokenImage";

type Props = {
  tokenSymbol: string;
  className?: string;
  tokenName?: string;
  tokenImageClass?: string;

  tokenNameClass?: string;
  tokenSymbolClass?: string;
  showBracket?: boolean;
  showSymbol?: boolean;
};

const TokenLogo = ({
  tokenSymbol,
  className,
  tokenName,
  tokenImageClass,
  tokenNameClass,
  tokenSymbolClass,
  showBracket,
  showSymbol = true,
}: Props) => {
  return (
    <div className={`flex gap-2 items-center ${className ? className : ""}`}>
      <Image
        className={`${
          tokenImageClass ? tokenImageClass : "w-5 h-5 rounded-full"
        }`}
        width={128}
        height={128}
        src={getImageUrlfromTokenSymbol(tokenSymbol)}
        alt={`${tokenSymbol} Token`}
      />
      {tokenName && (
        <p className={`${tokenNameClass ? tokenNameClass : ""}`}>{tokenName}</p>
      )}
      {showSymbol && ( // Only show the symbol if showSymbol is true
        <p className={`${tokenSymbolClass ? tokenSymbolClass : ""}`}>
          {showBracket ? `(${tokenSymbol})` : tokenSymbol}
        </p>
      )}
    </div>
  );
};

export default TokenLogo;
