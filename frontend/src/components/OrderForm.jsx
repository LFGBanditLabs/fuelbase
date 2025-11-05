import React, { useState } from "react";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { parseEther } from "viem";

const OrderForm = ({ contractAddress, pricePerLiter }) => {
  const [fuelAmount, setFuelAmount] = useState("");
  const [location, setLocation] = useState("");
  const { address } = useAccount();

  const { write: createOrder, data: orderData } = useContractWrite({
    address: contractAddress,
    abi: ["function createOrder(string,uint256)"],
    functionName: "createOrder",
  });

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: orderData?.hash,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalPrice = parseFloat(fuelAmount) * parseFloat(pricePerLiter);
    createOrder({
      args: [location, fuelAmount],
      value: parseEther(totalPrice.toString()),
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Order Fuel</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Delivery Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter delivery address"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Fuel Amount (Liters)
          </label>
          <input
            type="number"
            value={fuelAmount}
            onChange={(e) => setFuelAmount(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter amount in liters"
            required
          />
        </div>
        <button
          type="submit"
          disabled={!address || isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? "Processing..." : "Place Order"}
        </button>
        {isSuccess && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
            Order placed successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default OrderForm;
