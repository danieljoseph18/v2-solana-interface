import React, { useEffect, useState } from "react";
import { getPriceDecimals } from "@/lib/web3/formatters";
import { Button } from "@nextui-org/react";
import { useAsset } from "../assets/AssetContext";
import { helperToast } from "@/lib/helperToast";
import CustomTooltip from "@/components/common/CustomTooltip";

interface OrdersTableProps {
  orders: Order[];
  handleOrderClose: (order: Order) => void;
  triggerGetTradeData: () => void;
  prices: { [key: string]: number };
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  handleOrderClose,
  triggerGetTradeData,
  prices,
}) => {
  const { allAssets, setAsset } = useAsset();

  const [vaultPrices, setVaultPrices] = useState<{
    ethPrice: number;
    usdcPrice: number;
  }>({
    ethPrice: 0,
    usdcPrice: 0,
  });

  const [leverages, setLeverages] = useState<{ [key: string]: number }>({});

  const [cancellableOrders, setCancellableOrders] = useState<{
    [key: string]: boolean;
  }>({});

  const handleAssetSwitch = async (symbol: string) => {
    const asset = allAssets.find((asset) => asset.symbol === symbol);
    if (!asset) return;
    setAsset(asset);
  };

  useEffect(() => {
    const getLeverage = (order: Order) => {
      if (!vaultPrices.ethPrice || !vaultPrices.usdcPrice) return;
      let collateralPrice = 0;
      let collateralDelta = 0;
      if (order.isLong) {
        collateralPrice = vaultPrices.ethPrice;
      } else {
        collateralPrice = vaultPrices.usdcPrice;
      }
      // Convert collateral delta to usd
      const collateralUsd = collateralDelta * collateralPrice;

      const leverage = Number((order.size / collateralUsd).toFixed(2));

      setLeverages((prevLeverages) => ({
        ...prevLeverages,
        [order.symbol]: leverage,
      }));
    };

    orders.forEach((order) => getLeverage(order));
  }, [allAssets, orders, vaultPrices]);

  const getColourForOrderType = (orderType: string) => {
    switch (orderType) {
      case "Buy Limit":
        return "text-printer-green";
      case "Sell Limit":
        return "text-printer-red";
      case "Stop Loss":
        return "text-printer-red";
      case "Take Profit":
        return "text-printer-green";
      default:
        return "text-base-gray";
    }
  };

  return (
    <table className="min-w-full divide-y divide-cardborder">
      <thead>
        <tr className="bg-dark-1">
          <th className="px-7 py-4 text-left text-xs font-medium text-base-gray tracking-wider">
            Position / Order Type
          </th>
          <th className="px-7 py-4 text-left text-xs font-medium text-base-gray tracking-wider">
            Size / Leverage
          </th>
          <th className="px-7 py-4 text-left text-xs font-medium text-base-gray tracking-wider">
            Trigger Price
          </th>
          <th className="px-7 py-4 text-left text-xs font-medium text-base-gray tracking-wider">
            Mark Price
          </th>
          <th className="px-7 py-4 text-left text-xs font-medium text-base-gray tracking-wider">
            Time Created
          </th>
          <th className="px-7 py-4 text-left text-xs font-medium text-base-gray tracking-wider">
            Manage Position
          </th>
        </tr>
      </thead>
      <tbody className="border-b border-cardborder bg-card-grad text-white text-sm">
        {orders.map((order, index) => {
          const markPrice = prices[order.symbol] || 0;
          const priceDecimals = getPriceDecimals(markPrice);

          return (
            <tr
              key={index}
              onClick={() => handleAssetSwitch(order.symbol)}
              className="border-y-cardborder border-y-1 bg-card-grad cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span>{`${order.symbol.split(":")[0]}/USD`}</span>
                  <span className={getColourForOrderType(order.orderType)}>
                    {order.orderType}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span>{`${order.size.toFixed(2)} USD`}</span>
                  <span className="text-printer-green">
                    {`${leverages[order.symbol] || 0}x`}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {`${
                  order.triggerAbove ? "≥" : "≤"
                }$${order.triggerPrice.toFixed(
                  getPriceDecimals(order.triggerPrice)
                )}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {`$${markPrice.toFixed(priceDecimals)}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {order.timeCreated}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <CustomTooltip
                  content={
                    cancellableOrders[order.orderKey]
                      ? ""
                      : "Order cannot be cancelled yet due to insufficient delay"
                  }
                  isDisabled={cancellableOrders[order.orderKey]}
                >
                  <Button
                    className="ml-2 text-white px-2 cursor-pointer bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                    onPress={() => order}
                    disabled={!cancellableOrders[order.orderKey]}
                  >
                    Cancel
                  </Button>
                </CustomTooltip>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default OrdersTable;
