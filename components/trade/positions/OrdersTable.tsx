import React from "react";
import { getPriceDecimals } from "@/lib/web3/formatters";
import { Button } from "@nextui-org/react";
import { useAsset } from "../assets/AssetContext";
import { formatDateTime } from "@/lib/utils/dates";
import { useWallet } from "@/hooks/useWallet";
import { helperToast } from "@/lib/helperToast";

interface OrdersTableProps {
  orders: Order[];
  prices: { [key: string]: number };
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, prices }) => {
  const { allAssets, setAsset } = useAsset();
  const { address } = useWallet();

  const handleAssetSwitch = async (symbol: string) => {
    const asset = allAssets.find((asset) => asset.symbol === symbol);
    if (!asset) return;
    setAsset(asset);
  };

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

  const cancelLimitOrder = async (order: Order) => {
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    try {
      const response = await fetch(
        `${BACKEND_URL}/limit-orders/${order.orderId}?publicKey=${address}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        console.log("Order cancelled successfully");
        helperToast.success("Order cancelled successfully");
      } else {
        console.error("Failed to cancel order");
        helperToast.error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      helperToast.error("Error cancelling order: " + error);
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
          const markPrice = prices[order.marketId] || 0;
          const priceDecimals = getPriceDecimals(markPrice);

          const triggerAbove = order.triggerPrice > markPrice;

          return (
            <tr
              key={index}
              onClick={() => handleAssetSwitch(order.symbol)}
              className="border-y-cardborder border-y-1 bg-card-grad cursor-pointer"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span>{`${order.symbol}/USD`}</span>
                  <span className={getColourForOrderType(order.orderType)}>
                    {order.orderType}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span>{`${order.size.toFixed(2)} USD`}</span>
                  <span className="text-printer-green">
                    {`${order.leverage}x`}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {`${triggerAbove ? "≥" : "≤"}$${order.triggerPrice.toFixed(
                  getPriceDecimals(order.triggerPrice)
                )}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {`$${markPrice.toFixed(priceDecimals)}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatDateTime(order.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Button
                  className="ml-2 text-white px-2 cursor-pointer bg-p3-button hover:bg-p3-button-hover border-2 border-p3 !rounded-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  onPress={() => cancelLimitOrder(order)}
                >
                  Cancel
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default OrdersTable;
