import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowRight, FaArrowUp } from "react-icons/fa";
import { LuFileClock } from "react-icons/lu";
import Image from "next/image";
import DashboardSwiper from "./DashboardSwiper";
import { formatFloatWithCommas } from "@/lib/web3/formatters";
import AccountGrowthChart from "./AccountGrowthChart";
import { helperToast } from "@/lib/helperToast";
import { getImageUrlFromTokenSymbol } from "@/lib/utils/getTokenImage";
import { useWallet } from "@/hooks/useWallet";

interface TokenInfo {
  symbol: string;
  name: string;
}

const tokens: TokenInfo[] = [
  {
    symbol: "SOL",
    name: "Solana",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
  },
];

const DashboardView = ({
  setShowDepositView,
  setShowWithdrawView,
  setShowHistoryView,
  closeAccountOverlay,
  prices,
}: {
  setShowDepositView: () => void;
  setShowWithdrawView: () => void;
  setShowHistoryView: () => void;
  closeAccountOverlay: () => void;
  prices: { [key: string]: number };
}) => {
  const [totalValue, setTotalValue] = useState(0);
  const { disconnect, balances } = useWallet();

  const actions: {
    name: string;
    icon: React.ReactNode;
    action: () => void;
    rotate25?: boolean;
  }[] = [
    {
      name: "Withdraw",
      icon: <FaArrowUp />,
      action: () => {
        setShowWithdrawView();
      },
      rotate25: false,
    },
    {
      name: "Deposit",
      icon: <FaArrowDown />,
      action: () => {
        setShowDepositView();
      },
      rotate25: false,
    },
    {
      name: "History",
      icon: <LuFileClock />,
      action: () => {
        setShowHistoryView();
      },
      rotate25: false,
    },
  ];

  // Add a new state for the chart key
  const [chartKey, setChartKey] = useState(0);

  const handleDisconnect = async () => {
    await disconnect();
    closeAccountOverlay();
    helperToast.info("Wallet Disconnected");
  };

  useEffect(() => {
    const solBalance = balances.solBalance;
    const usdcBalance = balances.usdcBalance;

    const solPrice = prices.SOL;
    const usdcPrice = prices.USDC;

    const totalValue = solBalance * solPrice + usdcBalance * usdcPrice;

    setTotalValue(totalValue);
  }, [balances, prices]);

  return (
    <div className="min-h-screen h-full bg-card-grad text-white p-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium text-nowrap">My Smart Wallet</h1>
          <div className="flex items-center gap-2">
            {/* Used to Hide Slide the Pop-up Back Right */}
            <div className="flex items-center justify-center bg-input-grad border-2 border-cardborder !rounded-3 p-3 hover:opacity-80 transition-opacity cursor-pointer">
              <FaArrowRight
                className="text-white"
                onClick={() => {
                  closeAccountOverlay();
                }}
              />
            </div>
          </div>
        </div>
        <div className="py-6 mb-6">
          <h2 className="text-base font-medium text-dashboard-gray">
            My Balance
          </h2>
          <p className="text-4xl font-medium mb-4">
            US${isNaN(totalValue) ? 0 : formatFloatWithCommas(totalValue)}
          </p>
          <AccountGrowthChart
            key={chartKey}
            smartAccountAddress={"0x"}
            chainId={1}
          />
          <div className="flex gap-4 mt-4 items-center justify-between">
            {actions.map((action) => (
              <div
                key={action.name}
                className="flex flex-col items-center justify-center gap-3"
              >
                <button
                  className={`bg-white-card-grad text-sexy-gray flex items-center justify-center gap-2 rounded-full border-white border-1 text-2xl w-16 h-16 hover:opacity-80 transition-opacity cursor-pointer ${
                    action.rotate25 ? "-rotate-[25deg]" : ""
                  }`}
                  onClick={action.action}
                >
                  {action.icon}
                </button>
                <p className="text-sm font-light text-white">{action.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center relative w-full overflow-x-hidden h-fit min-h-[200px]">
          <DashboardSwiper />
        </div>
        <div className="w-full h-[1px] bg-white opacity-20 my-6"></div>
        {tokens.map((token) => (
          <div
            key={token.symbol}
            className="flex items-center justify-between gap-2 w-full mb-4"
          >
            <div className="flex gap-2 items-center">
              <Image
                src={getImageUrlFromTokenSymbol(token.symbol)}
                alt={`${token.symbol} Logo`}
                width={37}
                height={37}
                className="rounded-full"
              />
              <div>
                <p className="text-white font-medium">{token.name}</p>
                <p className="font-medium text-dashboard-gray text-base">
                  $
                  {prices[token.symbol]
                    ? prices[token.symbol].toFixed(2)
                    : "0.00"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-white font-medium text-end">
                {token.symbol === "SOL"
                  ? balances.solBalance
                  : balances.usdcBalance}
                {token.symbol}
              </p>
              <p className="font-medium text-dashboard-gray text-base text-end">
                US$
                {formatFloatWithCommas(
                  token.symbol === "SOL"
                    ? balances.solBalance * prices.SOL
                    : balances.usdcBalance * prices.USDC
                )}
              </p>
            </div>
          </div>
        ))}
        <div className="w-full h-[1px] bg-white opacity-20 my-6"></div>
        <div className="flex items-center justify-center py-6">
          <button
            className="text-printer-red hover:text-red-bottom cursor-pointer"
            onClick={handleDisconnect}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
