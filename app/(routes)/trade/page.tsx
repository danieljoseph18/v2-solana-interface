"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import AssetBanner from "@/components/trade/assets/AssetBanner";
import Positions from "@/components/trade/positions/Positions";
import TabNavigation from "@/components/trade/positions/TabNavigation";
import useWindowSize from "@/hooks/useWindowSize";
import { AssetProvider } from "@/components/trade/assets/AssetContext";
import { ResolutionString } from "@/public/static/charting_library/charting_library";
import Script from "next/script";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import TradeButtons from "@/components/trade/interaction/TradeButtons";
import TypeButtons from "@/components/trade/interaction/TypeButtons";
import SizeInput from "@/components/trade/interaction/SizeInput";
import MarketStats from "@/components/trade/stats/MarketStats";
import Loader from "@/components/trade/TVChartContainer/Loader";
import { ChartLine } from "@/components/trade/TVChartContainer/TradingViewChart";
import { formatUnixTimestamp, getPriceDecimals } from "@/lib/web3/formatters";
import { Selection } from "@nextui-org/react";
import ModalV2 from "@/components/common/ModalV2";
import ModalClose from "@/components/common/ModalClose";
import { getChartSymbol } from "@/components/trade/TVChartContainer/trading-view-symbols";
import { TVDataProvider } from "@/components/tradingview/TVDataProvider";
import { v4 as uuidv4 } from "uuid";
import SSEListener from "@/components/trade/positions/SSEListener";

const TradingViewChart = dynamic(
  () =>
    import("@/components/trade/TVChartContainer/TradingViewChart").then(
      (mod) => mod.default
    ),
  { ssr: false }
);

const TradePage = () => {
  const [activeTab, setActiveTab] = useState("My Trades");
  const { width } = useWindowSize();

  const pathname = usePathname();

  // Onchain Price for the current asset in context
  const [markPrice, setMarkPrice] = useState(0);

  // Chart Price
  const [chartPrice, setChartPrice] = useState(0);
  const [isScriptReady, setIsScriptReady] = useState(false);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [isLong, setIsLong] = useState(true);
  const [activeType, setActiveType] = useState("Market");
  const [openPositions, setOpenPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [closedPositions, setClosedPositions] = useState<ClosedPosition[]>([]);
  const [chartLines, setChartLines] = useState<ChartLine[]>([]);
  // Pass into size input
  const [liqPrice, setLiqPrice] = useState(0);
  const [collateral, setCollateral] = useState<string>("");
  const [leverage, setLeverage] = useState(1.1);
  const [priceDecimals, setPriceDecimals] = useState(7);
  const [showPositionLines, setShowPositionLines] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [currentMarketOnly, setCurrentMarketOnly] = useState(false);
  const [refreshVolume, setRefreshVolume] = useState(0);
  const [marketTokenPrices, setMarketTokenPrices] = useState<{
    ethPrice: number;
    usdcPrice: number;
  }>({
    ethPrice: 0,
    usdcPrice: 0,
  });
  const [marketStats, setMarketStats] = useState<{
    borrowRateLong: number;
    borrowRateShort: number;
    fundingRate: number;
    fundingRateVelocity: number;
    availableLiquidityLong: number;
    availableLiquidityShort: number;
    openInterestLong: number;
    openInterestShort: number;
  }>({
    borrowRateLong: 0,
    borrowRateShort: 0,
    fundingRate: 0,
    fundingRateVelocity: 0,
    availableLiquidityLong: 0,
    availableLiquidityShort: 0,
    openInterestLong: 0,
    openInterestShort: 0,
  });
  const [pendingPositions, setPendingPositions] = useState<Position[]>([]);
  const [decreasingPosition, setDecreasingPosition] = useState<Position | null>(
    null
  );

  const tvDataProviderRef = useRef<TVDataProvider | null>(null);

  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set(["1"])
  );

  const positionsRef = useRef({ openPositions, orders, closedPositions });

  useEffect(() => {
    positionsRef.current = { openPositions, orders, closedPositions };
  }, [openPositions, orders, closedPositions]);

  const openTradeModal = (newIsLong: boolean) => {
    setIsLong(newIsLong);
    setIsTradeModalOpen(true);
  };

  const closeTradeModal = () => {
    setIsTradeModalOpen(false);
  };

  const createPendingPosition = (position: Position) => {
    const pendingPosition: Position = {
      id: uuidv4(),
      isPending: true,
      symbol: position.symbol || "",
      isLong: position.isLong || false,
      size: position.size || 0,
      collateral: position.collateral || 0,
      entryPrice: 0,
      entryTime: formatUnixTimestamp(Date.now() / 1000),
      liqPrice: 0,
      adlEvents: [],
      marketId: `0x0`,
      positionKey: `0x0`,
    };
    // Wait 3s
    setTimeout(() => {}, 3000);
    setPendingPositions((prevPositions) => [pendingPosition, ...prevPositions]);
  };

  const refreshPendingPosition = useCallback(
    async (id: string, success: boolean) => {
      // if (!account connected return )

      if (success) {
        const fetchPositionsWithRetry = async (
          retryCount = 0
        ): Promise<void> => {
          // Wait for 3 seconds before calling getAllPositions
          await new Promise((resolve) => setTimeout(resolve, 3000));

          try {
            // Fetch all updated positions
            let newOpenPositions: Position[] = [];
            let newOrders: Order[] = [];
            let newClosedPositions: ClosedPosition[] = [];

            const filteredPendingPositions = pendingPositions.filter(
              (pos) => pos.id !== id
            );

            // Remove the pending position
            setPendingPositions(filteredPendingPositions);

            if (
              newOpenPositions.length === openPositions.length &&
              retryCount < 2
            ) {
              // If there's no change in openPositions, retry after 3 seconds
              return fetchPositionsWithRetry(retryCount + 1);
            }

            // Update all position states
            setOpenPositions(newOpenPositions);
            setOrders(newOrders);
            setClosedPositions(newClosedPositions);
          } catch (error) {
            console.error("Error refreshing positions:", error);
          }
        };

        fetchPositionsWithRetry();
      } else {
        // If not successful, simply remove the pending position
        setPendingPositions((prevPositions) =>
          prevPositions.filter((pos) => pos.id !== id)
        );
      }
    },
    [
      marketTokenPrices.ethPrice,
      marketTokenPrices.usdcPrice,
      openPositions.length,
      pendingPositions,
    ]
  );

  const fetchPositionData = useCallback(
    async (shouldRefresh: boolean) => {
      if (
        allAssets.length === 0 ||
        marketTokenPrices.ethPrice === 0 ||
        marketTokenPrices.usdcPrice === 0
      ) {
        return;
      }

      setIsTableLoading(true);

      try {
        let newOpenPositions: Position[] = [];
        let newOrders: Order[] = [];
        let newClosedPositions: ClosedPosition[] = [];

        setOpenPositions(newOpenPositions);
        setOrders(newOrders);
        setClosedPositions(newClosedPositions);
      } catch (error) {
        console.error("Error fetching position data:", error);
      } finally {
        setIsTableLoading(false);
      }
    },
    [allAssets.length, marketTokenPrices.ethPrice, marketTokenPrices.usdcPrice]
  );

  // Fetch position data once when component mounts or when critical dependencies change
  useEffect(() => {
    fetchPositionData(false);
  }, [fetchPositionData]);

  useEffect(() => {
    setMarkPrice(0);
  }, [asset]);

  useEffect(() => {
    setIsTablet(width !== undefined && width <= 768);
  }, [width]);

  useEffect(() => {
    const fetchPriceDecimals = async () => {
      if (!markPrice) return;
      const priceDecimals = getPriceDecimals(markPrice);
      setPriceDecimals(priceDecimals);
    };

    fetchPriceDecimals();
  }, [markPrice]);

  useEffect(() => {
    setIsScriptReady(false);
  }, [pathname]);

  useEffect(() => {
    if (!isScriptReady) {
      setIsScriptReady(true);
    }
  }, [isScriptReady]);

  useEffect(() => {
    const getChartLines = (positions: Position[], orders: Order[]) => {
      if (!asset) return;

      const lines: ChartLine[] = [];

      positions.forEach((position) => {
        const entryLine: ChartLine = {
          price: position.entryPrice,
          title: `Opened ${position.symbol} - ${
            position.isLong ? "Long" : "Short"
          }`,
          type: "entry",
          symbol: position.symbol,
        };
        const liquidationLine: ChartLine = {
          price: position.liqPrice,
          title: `Liquidation ${position.symbol} - ${
            position.isLong ? "Long" : "Short"
          }`,
          type: "liquidation",
          symbol: position.symbol,
        };
        lines.push(entryLine);
        lines.push(liquidationLine);
      });

      orders.forEach((order) => {
        const orderLine: ChartLine = {
          price: order.triggerPrice,
          // Covers Buy / Sell Limits, Stop Losses and Take Profits
          title: `${order.symbol} ${order.orderType} - ${
            order.isLong ? "Long" : "Short"
          }`,
          type: order.orderType,
          symbol: order.symbol,
        };
        lines.push(orderLine);
      });

      const filteredLines = lines.filter((line) => {
        return line.symbol === asset.customId;
      });

      setChartLines(filteredLines);
    };

    getChartLines(openPositions, orders);
  }, [openPositions, orders, asset]);

  const isMarkPriceReady = markPrice !== 0;

  return (
    <AssetProvider
      asset={asset}
      setAsset={setAsset}
      allAssets={allAssets}
      setAllAssets={setAllAssets}
    >
      <SSEListener onUpdate={() => fetchPositionData(true)} timeout={5000} />
      <div
        className={`flex flex-col gap-4 relative lg:gap-0 lg:mt-0 lg:px-0 lg:flex-row w-full md:max-h-[90vh] bottom-0 left-0 right-0 bg-[#07080A] 3xl:border-b border-cardborder 3xl:border-x`}
      >
        <div
          className={` flex flex-col lg:gap-0 lg:w-[70%] lg:overflow-y-auto lg:sticky lg:max-h-[90vh] lg:left-0 lg:top-0 lg:h-fit no-scrollbar lg:pb-20  lg:border-r-2 border-r-cardborder  `}
        >
          <AssetBanner markPrice={markPrice} refreshVolume={refreshVolume} />
          <Script
            src="/static/datafeeds/udf/dist/bundle.js"
            strategy="lazyOnload"
            onLoad={() => {
              setIsScriptReady(true);
            }}
          />
          <div className="relative w-full !h-[550px] !min-h-[550px]">
            <div className="w-full h-full overflow-hidden">
              <iframe
                height="100%"
                width="100%"
                id="geckoterminal-embed"
                title="GeckoTerminal Embed"
                src={`https://www.geckoterminal.com/solana/pools/F3N4RdnY3AtUSuqQcGo49EkgPd1Duuoo1XFEnKssMgwF?embed=1&info=0&swaps=0`}
                allow="clipboard-write"
                allowFullScreen
              ></iframe>
            </div>
            {/* {asset && isScriptReady && isMarkPriceReady ? (
              // To Chart Positions, pass orders in to chartLines below
              <TradingViewChart
                asset={asset}
                markPrice={markPrice}
                assetForPrice={asset.symbol}
                setChartPrice={setChartPrice}
                symbol={getChartSymbol(asset)}
                priceDecimals={asset.priceDecimals ?? 2}
                period={"1" as ResolutionString}
                onSelectToken={setAsset}
                savedShouldShowPositionLines={showPositionLines}
                chartLines={chartLines}
              />
            ) : (
              <Loader />
            )} */}
          </div>

          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            chartPositions={showPositionLines}
            setChartPositions={setShowPositionLines}
            currentMarketOnly={currentMarketOnly}
            setCurrentMarketOnly={setCurrentMarketOnly}
          />

          <Positions
            activeTab={activeTab}
            openPositions={openPositions}
            orders={orders}
            closedPositions={closedPositions}
            triggerGetTradeData={() => {}}
            isTableLoading={isTableLoading}
            currentMarketOnly={currentMarketOnly}
            pendingPositions={pendingPositions}
            updateMarketStats={() => {}}
            decreasingPosition={decreasingPosition}
            setDecreasingPosition={setDecreasingPosition}
          />
        </div>
        <div
          className={`flex flex-col justify-start lg:w-[30%] lg:sticky lg:overflow-y-auto lg:max-h-[90vh] lg:right-0 lg:top-0 no-scrollbar pb-20 lg:pb-20`}
        >
          {!isTablet && (
            <div className="flex flex-col w-full h-auto">
              <div className="flex flex-col w-full gap-4 bg-card-grad border-cardborder border-2 lg:!border-l-0 p-4">
                <TradeButtons isLong={isLong} setIsLong={setIsLong} />
                <TypeButtons
                  activeType={activeType}
                  setActiveType={setActiveType}
                  isEntry={true}
                />
                <SizeInput
                  isLong={isLong}
                  activeType={activeType}
                  leverage={leverage}
                  setLeverage={setLeverage}
                  collateral={collateral}
                  setCollateral={setCollateral}
                  markPrice={markPrice}
                  liqPrice={liqPrice || 0}
                  priceDecimals={priceDecimals}
                  triggerRefetchPositions={() => {}}
                  marketStats={marketStats}
                  triggerRefreshVolume={() =>
                    setRefreshVolume((prev) => prev + 1)
                  }
                  updateMarketStats={() => {}}
                  createPendingPosition={createPendingPosition}
                  refreshPendingPosition={refreshPendingPosition}
                />
              </div>
              <MarketStats
                isLong={isLong}
                entryPrice={markPrice ?? 0.0}
                liqPrice={liqPrice || 0}
                priceDecimals={priceDecimals}
                marketStats={marketStats}
              />
            </div>
          )}
        </div>
      </div>
      {isTablet && (
        <div className="fixed bottom-[4.6rem] md:bottom-[7.3rem] z-50 left-0 right-0 bg-card-grad border-y-2 border-cardborder p-4">
          <TradeButtons
            isLong={isLong}
            setIsLong={setIsLong}
            openTradeModal={openTradeModal}
          />
        </div>
      )}
      <ModalV2 isOpen={isTradeModalOpen} setIsModalOpen={setIsTradeModalOpen}>
        <div className="flex flex-col h-screen w-screen fixed inset-0 z-[150] bg-card-grad overflow-y-auto overscroll-y-auto custom-scrollbar">
          <div className="flex-grow pb-24 md:pb-0">
            <div className="flex flex-col w-full gap-4 p-4 min-h-screen">
              <div className="flex flex-row justify-between w-full items-center">
                <p className="text-xl font-bold text-white">Trade</p>
                <ModalClose onClose={closeTradeModal} />
              </div>
              <TypeButtons
                activeType={activeType}
                setActiveType={setActiveType}
                isEntry={true}
              />
              <SizeInput
                isLong={isLong}
                activeType={activeType}
                leverage={leverage}
                setLeverage={setLeverage}
                collateral={collateral}
                setCollateral={setCollateral}
                markPrice={markPrice}
                liqPrice={liqPrice || 0}
                priceDecimals={priceDecimals}
                triggerRefetchPositions={() => {
                  closeTradeModal(); //Close the modal after execution
                }}
                marketStats={marketStats}
                triggerRefreshVolume={() =>
                  setRefreshVolume((prev) => prev + 1)
                }
                updateMarketStats={() => {}}
                createPendingPosition={createPendingPosition}
                refreshPendingPosition={refreshPendingPosition}
              />
            </div>
          </div>
        </div>
      </ModalV2>
    </AssetProvider>
  );
};

export default TradePage;
