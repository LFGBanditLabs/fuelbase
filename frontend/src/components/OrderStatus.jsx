import React from "react";
import { useContractRead } from "wagmi";

const OrderStatus = ({ orderId, contractAddress }) => {
  const { data: order } = useContractRead({
    address: contractAddress,
    abi: [
      "function getOrder(uint256) view returns (tuple(uint256,address,string,uint256,uint256,uint8,uint256))",
    ],
    functionName: "getOrder",
    args: [orderId],
  });

  const getStatusText = (status) => {
    const statuses = [
      "Pending",
      "Confirmed",
      "InTransit",
      "Delivered",
      "Cancelled",
    ];
    return statuses[status] || "Unknown";
  };

  if (!order) return null;

  return (
    <div className="p-4 border rounded-lg mb-4">
      <h3 className="text-lg font-semibold mb-2">Order #{orderId}</h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="text-gray-600">Status:</div>
        <div className="font-medium">{getStatusText(order[5])}</div>
        <div className="text-gray-600">Amount:</div>
        <div className="font-medium">{order[3].toString()} liters</div>
        <div className="text-gray-600">Total Price:</div>
        <div className="font-medium">{order[4].toString()} wei</div>
        <div className="text-gray-600">Location:</div>
        <div className="font-medium">{order[2]}</div>
      </div>
    </div>
  );
};

export default OrderStatus;
