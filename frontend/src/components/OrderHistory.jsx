import React from "react";
import { useAccount, useContractRead } from "wagmi";
import OrderStatus from "./OrderStatus";

const OrderHistory = ({ contractAddress }) => {
  const { address } = useAccount();

  const { data: orderIds } = useContractRead({
    address: contractAddress,
    abi: ["function getCustomerOrders(address) view returns (uint256[])"],
    functionName: "getCustomerOrders",
    args: [address],
  });

  if (!address) {
    return (
      <div className="text-center p-4">
        Please connect your wallet to view order history
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Order History</h2>
      {orderIds?.length === 0 ? (
        <p className="text-gray-600">No orders found</p>
      ) : (
        orderIds?.map((orderId) => (
          <OrderStatus
            key={orderId.toString()}
            orderId={orderId}
            contractAddress={contractAddress}
          />
        ))
      )}
    </div>
  );
};

export default OrderHistory;
