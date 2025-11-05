import React from "react";
import { Web3Button } from "@web3modal/react";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">FuelBase</h1>
        <Web3Button />
      </div>
    </header>
  );
};

export default Header;
