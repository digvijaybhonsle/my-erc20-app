/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";

// Define the context type
interface WalletContextType {
  account: string | null;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
  provider: ethers.providers.Web3Provider | null;
}

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Provider component
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const browserProvider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      setProvider(browserProvider);
      setAccount(accounts[0]);
    } else {
      alert("MetaMask not found. Please install it.");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      (window.ethereum as ethers.providers.ExternalProvider & { on?: (event: string, handler: (...args: any[]) => void) => void })
        ?.on?.("accountsChanged", (accounts: string[]) => {
          setAccount(accounts[0] || null);
        });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, connectWallet, isConnected: !!account, provider }}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook for accessing the wallet context
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
