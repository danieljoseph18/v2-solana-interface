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
import { getPriceDecimals } from "@/lib/web3/formatters";
import { Selection } from "@nextui-org/react";
import ModalV2 from "@/components/common/ModalV2";
import ModalClose from "@/components/common/ModalClose";
import { getChartSymbol } from "@/components/trade/TVChartContainer/trading-view-symbols";
import { TVDataProvider } from "@/components/tradingview/TVDataProvider";
import SSEListener from "@/components/trade/positions/SSEListener";
import { getAssets } from "@/app/actions/getAssets";
import useInterval from "@/hooks/useInterval";
import {
  estimateLiquidationPrice,
  preCalculateLiquidationPrice,
} from "@/lib/web3/position/estimateLiquidationPrice";
import { useWallet } from "@/hooks/useWallet";

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

  const { address } = useWallet();

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
  const [closedPositions, setClosedPositions] = useState<Position[]>([]);
  const [chartLines, setChartLines] = useState<ChartLine[]>([]);
  // Pass into size input
  const [collateral, setCollateral] = useState<string>("");
  const [leverage, setLeverage] = useState(1.1);
  const [priceDecimals, setPriceDecimals] = useState(7);
  const [showPositionLines, setShowPositionLines] = useState(true);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [currentMarketOnly, setCurrentMarketOnly] = useState(false);
  const [marketStats, setMarketStats] = useState<{
    borrowRateLong: number;
    borrowRateShort: number;
    fundingRate: number;
    fundingRateVelocity: number;
    openInterestLong: number;
    openInterestShort: number;
  }>({
    borrowRateLong: 0,
    borrowRateShort: 0,
    fundingRate: 0,
    fundingRateVelocity: 0,
    openInterestLong: 0,
    openInterestShort: 0,
  });

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

  const fetchPositionData = useCallback(async () => {
    if (!address) {
      return;
    }

    setIsTableLoading(true);

    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    try {
      // Fetch positions and orders in parallel
      const [positionResponse, orderResponse] = await Promise.all([
        fetch(`${BACKEND_URL}/trade/positions?publicKey=${address}`),
        fetch(`${BACKEND_URL}/limit-orders?publicKey=${address}`),
      ]);

      const [positionData, orderData]: [
        PositionReturnType[],
        OrderReturnType[]
      ] = await Promise.all([positionResponse.json(), orderResponse.json()]);

      if (positionData.length > 0) {
        const mappedPositions: Position[] = positionData.map((pos) => {
          return {
            positionId: pos.id,
            userAddress: pos.userId,
            symbol: pos.symbol,
            marketId: pos.marketId,
            isLong: pos.side === "LONG",
            size: Number(pos.size),
            leverage: Number(pos.leverage),
            entryPrice: Number(pos.entryPrice),
            stopLossPrice: pos.stopLossPrice
              ? Number(pos.stopLossPrice)
              : undefined,
            takeProfitPrice: pos.takeProfitPrice
              ? Number(pos.takeProfitPrice)
              : undefined,
            trailingStopDistance: pos.trailingStopDistance
              ? Number(pos.trailingStopDistance)
              : undefined,
            status: pos.status,
            closingPrice: pos.closingPrice
              ? Number(pos.closingPrice)
              : undefined,
            margin: Number(pos.margin),
            marginToken: pos.token,
            lockedMarginSOL: Number(pos.lockedMarginSOL),
            lockedMarginUSDC: Number(pos.lockedMarginUSDC),
            realizedPnl: pos.realizedPnl ? Number(pos.realizedPnl) : undefined,
            accumulatedFunding: Number(pos.accumulatedFunding),
            accumulatedBorrowingFee: Number(pos.accumulatedBorrowingFee),
            lastBorrowingFeeUpdate: pos.lastBorrowingFeeUpdate,
            createdAt: pos.createdAt,
            updatedAt: pos.updatedAt,
          };
        });

        const newOpenPositions = mappedPositions.filter(
          (pos) => pos.status === "OPEN"
        );
        const newClosedPositions = mappedPositions.filter(
          (pos) => pos.status === "CLOSED" || pos.status === "LIQUIDATED"
        );

        setOpenPositions(newOpenPositions);
        setClosedPositions(newClosedPositions);
      }

      /**
       * @audit Need to add SL/TPS
       */
      if (orderData.length > 0) {
        const mappedOrders: Order[] = orderData.map((order) => {
          return {
            orderId: order.id,
            userAddress: order.userId,
            marketId: order.marketId,
            symbol: order.symbol,
            isLong: order.side === "LONG",
            size: Number(order.size),
            triggerPrice: Number(order.price),
            leverage: Number(order.leverage),
            marginToken: order.token,
            requiredMargin: Number(order.requiredMargin),
            status: order.status,
            orderType: "Limit", // Defaulted (add SL/TP)
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          };
        });

        const filteredOrders = mappedOrders.filter(
          (order) => order.status === "OPEN"
        );

        setOrders(filteredOrders);
      }
    } catch (error) {
      console.error("Error fetching position data:", error);
    } finally {
      setIsTableLoading(false);
    }
  }, [address]);

  // Fetch all assets
  useEffect(() => {
    const fetchAllAssets = async () => {
      const assets = await getAssets();
      setAllAssets(assets);
      if (assets.length > 0) {
        setAsset(assets[0]);
      }
    };
    fetchAllAssets();
  }, []);

  // Fetch position data once when component mounts or when critical dependencies change
  useEffect(() => {
    fetchPositionData();
  }, [fetchPositionData]);

  useEffect(() => {
    if (tvDataProviderRef.current) {
      tvDataProviderRef.current.updateLivePrice(markPrice);
    }
  }, [markPrice]);

  useEffect(() => {
    setMarkPrice(0);
  }, [asset]);

  useEffect(() => {
    if (!asset) return;
    setMarketStats({
      borrowRateLong: asset.borrowingRate || 0,
      borrowRateShort: asset.borrowingRate || 0,
      fundingRate: asset.fundingRate || 0,
      fundingRateVelocity: asset.fundingRateVelocity || 0,
      openInterestLong: asset.longOpenInterest || 0,
      openInterestShort: asset.shortOpenInterest || 0,
    });
  }, [asset]);

  // @audit - Can maybe set up a WS in backend to stream this
  const updatePriceForAsset = useCallback(async () => {
    if (asset && asset.symbol) {
      const BACKEND_URL =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

      try {
        const response = await fetch(`${BACKEND_URL}/price/market/${asset.id}`);

        if (response.ok) {
          const priceResponse: string = await response.json();
          setMarkPrice(Number(priceResponse));
        } else {
          console.error(`Failed to fetch data for ${asset.symbol}`);
        }
      } catch (error) {
        console.error(`Error fetching data for ${asset.symbol}:`, error);
      }
    }
  }, [asset]);

  useEffect(() => {
    setIsTablet(width !== undefined && width <= 768);
  }, [width]);

  // Update the price every 1 second
  useInterval(updatePriceForAsset, 1000);

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
          price: estimateLiquidationPrice(position),
          title: `Liquidation ${position.symbol} - ${
            position.isLong ? "Long" : "Short"
          }`,
          type: "liquidation",
          symbol: position.symbol,
        };
        lines.push(entryLine);
        lines.push(liquidationLine);

        // Add Stop Loss line if it exists
        if (position.stopLossPrice) {
          const stopLossLine: ChartLine = {
            price: position.stopLossPrice,
            title: `Stop Loss ${position.symbol} - ${
              position.isLong ? "Long" : "Short"
            }`,
            type: "Stop Loss",
            symbol: position.symbol,
          };
          lines.push(stopLossLine);
        }

        // Add Take Profit line if it exists
        if (position.takeProfitPrice) {
          const takeProfitLine: ChartLine = {
            price: position.takeProfitPrice,
            title: `Take Profit ${position.symbol} - ${
              position.isLong ? "Long" : "Short"
            }`,
            type: "Take Profit",
            symbol: position.symbol,
          };
          lines.push(takeProfitLine);
        }
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
        return line.symbol === asset?.symbol;
      });

      setChartLines(filteredLines);
    };

    getChartLines(openPositions, orders);
  }, [openPositions, orders, asset]);

  const isMarkPriceReady = markPrice !== 0;

  // Add a new state to track SSE updates
  const [sseUpdateCounter, setSSEUpdateCounter] = useState(0);

  // Use an effect to handle the actual data fetching
  useEffect(() => {
    if (sseUpdateCounter > 0) {
      fetchPositionData();
    }
  }, [sseUpdateCounter, fetchPositionData]);

  return (
    <AssetProvider
      asset={asset}
      setAsset={setAsset}
      allAssets={allAssets}
      setAllAssets={setAllAssets}
    >
      <SSEListener
        publicKey={address}
        onUpdate={() => {
          // Instead of directly fetching, increment the counter
          setSSEUpdateCounter((prev) => prev + 1);
        }}
        timeout={1_000}
      />
      <div
        className={`flex flex-col gap-4 relative lg:gap-0 lg:mt-0 lg:px-0 lg:flex-row w-full md:max-h-[90vh] bottom-0 left-0 right-0 bg-[#07080A] 3xl:border-b border-cardborder 3xl:border-x`}
      >
        <div
          className={` flex flex-col lg:gap-0 lg:w-[70%] lg:overflow-y-auto lg:sticky lg:max-h-[90vh] lg:left-0 lg:top-0 lg:h-fit no-scrollbar lg:pb-20  lg:border-r-2 border-r-cardborder  `}
        >
          <AssetBanner markPrice={markPrice} />
          <Script
            src="/static/datafeeds/udf/dist/bundle.js"
            strategy="lazyOnload"
            onLoad={() => {
              setIsScriptReady(true);
            }}
          />
          <div className="relative w-full !h-[550px] !min-h-[550px]">
            {asset && isScriptReady && isMarkPriceReady ? (
              // To Chart Positions, pass orders in to chartLines below
              <TradingViewChart
                asset={asset}
                markPrice={markPrice}
                assetForPrice={asset.symbol}
                setChartPrice={setChartPrice}
                symbol={getChartSymbol(asset)}
                priceDecimals={getPriceDecimals(markPrice) || 7}
                period={"1" as ResolutionString}
                onSelectToken={setAsset}
                savedShouldShowPositionLines={showPositionLines}
                chartLines={chartLines}
              />
            ) : (
              <Loader />
            )}
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
            isTableLoading={isTableLoading}
            currentMarketOnly={currentMarketOnly}
            updateMarketStats={() => {}}
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
                  liqPrice={
                    preCalculateLiquidationPrice(
                      markPrice,
                      Number(collateral),
                      Number(collateral) * leverage,
                      isLong
                    ) || 0
                  }
                  priceDecimals={priceDecimals}
                  triggerRefetchPositions={() => {}}
                  marketStats={marketStats}
                  availableLiquidity={
                    asset ? Number(asset.availableLiquidity) : 0
                  }
                  updateMarketStats={() => {}}
                />
              </div>
              <MarketStats
                isLong={isLong}
                entryPrice={markPrice ?? 0.0}
                priceDecimals={priceDecimals}
                marketStats={marketStats}
                availableLiquidity={
                  asset ? Number(asset.availableLiquidity) : 0
                }
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
                liqPrice={
                  preCalculateLiquidationPrice(
                    markPrice,
                    Number(collateral),
                    Number(collateral) * leverage,
                    isLong
                  ) || 0
                }
                priceDecimals={priceDecimals}
                triggerRefetchPositions={() => {
                  closeTradeModal(); //Close the modal after execution
                }}
                marketStats={marketStats}
                availableLiquidity={
                  asset ? Number(asset.availableLiquidity) : 0
                }
                updateMarketStats={() => {}}
              />
            </div>
          </div>
        </div>
      </ModalV2>
    </AssetProvider>
  );
};

export default TradePage;
