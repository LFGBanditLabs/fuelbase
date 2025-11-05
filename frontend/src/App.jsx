import React from 'react';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { base } from 'viem/chains';
import Header from './components/Header';
import OrderForm from './components/OrderForm';
import OrderHistory from './components/OrderHistory';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = 'YOUR_CONTRACT_ADDRESS';
const PRICE_PER_LITER = '0.001'; // in ETH, adjust as needed

const chains = [base];
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID';

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

function App() {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="container mx-auto py-8 px-4">
            <OrderForm 
              contractAddress={CONTRACT_ADDRESS} 
              pricePerLiter={PRICE_PER_LITER} 
            />
            <OrderHistory contractAddress={CONTRACT_ADDRESS} />
          </main>
        </div>
      </WagmiConfig>
      <Web3Modal 
        projectId={projectId} 
        ethereumClient={ethereumClient}
      />
    </>
  );
