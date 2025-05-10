/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { connectWallet } from "../services/wallet";

interface JoinWalletProps {
  setIsWalletConnected: (isConnected: boolean, address?: string) => void;
}

export default function JoinWallet({ setIsWalletConnected }: JoinWalletProps) {
  const [account, setAccount] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    if (!(window as any).ethereum) {
      setError("MetaMask not detected. Please install MetaMask first.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Prompt user to connect
      const { address } = await connectWallet();
      setAccount(address);
      setIsWalletConnected(true, address);
    } catch (err: any) {
      console.error("Wallet connection failed:", err);
      if (err.code === 4001) {
        setError("Connection request was rejected.");
      } else {
        setError("Failed to connect wallet. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualJoin = () => {
    if (!/^0x[a-fA-F0-9]{40}$/.test(manualAddress)) {
      setError("Please enter a valid Ethereum address.");
      return;
    }
    setError(null);
    setAccount(manualAddress);
    setIsWalletConnected(true, manualAddress);
  };

  const formatAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-gray-700 bg-opacity-60 backdrop-blur-md p-10 rounded-2xl shadow-lg max-w-md w-full text-center text-white space-y-6">
        <h2 className="text-3xl font-bold text-yellow-400">Join Your Wallet</h2>

        {error && (
          <div className="bg-red-600 text-white p-3 rounded">
            {error}
          </div>
        )}

        {/* MetaMask Connect */}
        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-gray-900 font-semibold py-3 rounded-full transition transform hover:scale-105"
        >
          {loading ? "Connecting…" : "Connect with MetaMask"}
        </button>

        <div className="flex items-center justify-center">
          <span className="border-b border-gray-500 w-1/5 lg:w-1/4"></span>
          <span className="px-2 text-gray-400">OR</span>
          <span className="border-b border-gray-500 w-1/5 lg:w-1/4"></span>
        </div>

        {/* Manual Address Entry */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Paste wallet address"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            className="w-full p-3 rounded-lg text-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-5"
          />
          <button
            onClick={handleManualJoin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-full transition transform hover:scale-105"
          >
            Join with Address
          </button>
        </div>

        {/* Connected Account Display */}
        {account && (
          <div className="bg-gray-800 p-4 rounded-lg text-left">
            <p className="text-gray-300">
              <span className="font-semibold text-white">Connected Account:</span>
              <br />
              <span className="text-yellow-400">{formatAddress(account)}</span>
            </p>
          </div>
        )}

        {/* Placeholder for contract call */}
        <button
          onClick={() => {/* your contract call here */}}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-full transition transform hover:scale-105"
        >
          Check Unlock Time
        </button>
      </div>
    </div>
  );
}
