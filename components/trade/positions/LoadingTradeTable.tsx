import React from "react";

const LoadingTradeTable = () => {
  return (
    <div className="overflow-y-auto custom-scrollbar">
      <table className="min-w-full divide-y divide-cardborder">
        <thead>
          <tr className=" bg-dark-1">
            <th className="px-7 py-4 text-left text-xs font-medium text-base-gray uppercase tracking-wider">
              <div className="flex flex-col">
                <span>Position /</span>
                <span>Side</span>
              </div>
            </th>
            <th className="px-7 py-4  text-left text-xs font-medium text-base-gray uppercase tracking-wider">
              <div className="flex flex-col">
                <span>Size /</span>
                <span>Leverage</span>
              </div>
            </th>
            <th className="px-7 py-4  text-left text-xs font-medium text-base-gray uppercase tracking-wider">
              <div className="flex flex-col">
                <span>Entry Price /</span>
                <span>Time</span>
              </div>
            </th>
            <th className="px-7 py-4  text-left text-xs font-medium text-base-gray uppercase tracking-wider">
              <div className="flex flex-col">
                <span>Mark Price /</span>
                <span>Liq Price</span>
              </div>
            </th>
            <th className="px-7 py-4  text-left text-xs font-medium text-base-gray uppercase tracking-wider">
              <div className="flex flex-col">
                <span>Profit /</span>
                <span>Loss</span>
              </div>
            </th>
            <th className="px-7 py-4 text-left text-xs font-medium text-base-gray uppercase tracking-wider">
              Manage Position
            </th>
          </tr>
        </thead>
        <tbody className="border-b border-cardborder bg-card-grad text-white text-sm">
          <tr className="animate-pulse">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="h-4 bg-table-gray rounded w-24 mb-2"></span>
                <span className="h-4 bg-table-gray rounded w-16"></span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="h-4 bg-table-gray rounded w-24 mb-2"></span>
                <span className="h-4 bg-table-gray rounded w-16"></span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="h-4 bg-table-gray rounded w-24 mb-2"></span>
                <span className="h-4 bg-table-gray rounded w-16"></span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="h-4 bg-table-gray rounded w-24 mb-2"></span>
                <span className="h-4 bg-table-gray rounded w-16"></span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="h-4 bg-table-gray rounded w-24 mb-2"></span>
                <span className="h-4 bg-table-gray rounded w-16"></span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex flex-col">
                <span className="h-4 bg-table-gray rounded w-24 mb-2"></span>
                <span className="h-4 bg-table-gray rounded w-16"></span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LoadingTradeTable;
