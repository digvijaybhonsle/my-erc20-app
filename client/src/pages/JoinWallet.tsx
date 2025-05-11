/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { connectWallet } from "../services/wallet";
import { motion, AnimatePresence } from "framer-motion";

interface JoinWalletProps {
  setIsWalletConnected: (isConnected: boolean, address?: string) => void;
}

export default function JoinWallet({ setIsWalletConnected }: JoinWalletProps) {
  const [account, setAccount] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleConnect = async () => {
    if (!(window as any).ethereum) {
      setError("MetaMask not detected. Please install MetaMask.");
      return;
    }

    try {
      setError(null);
      setSuccess(false);
      setLoading(true);

      const { address } = await connectWallet();
      setAccount(address);
      setIsWalletConnected(true, address);
      setSuccess(true);
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
    setSuccess(true);
  };

  const formatAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "";

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-gray-700 bg-opacity-60 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-lg max-w-md w-full text-center text-white space-y-6"
      >
        <motion.h2
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold text-yellow-400"
        >
          Join Your Wallet
        </motion.h2>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-600 text-white p-3 rounded"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-600 text-white p-3 rounded"
            >
              Wallet connected successfully!
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleConnect}
          disabled={loading}
          className={`w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-gray-900 font-semibold py-3 rounded-full transition transform hover:scale-105`}
        >
          {loading ? (
            <motion.span
              className="inline-block animate-spin mr-2"
              style={{ borderTop: "2px solid #000", borderRadius: "50%", width: "1rem", height: "1rem" }}
            />
          ) : null}
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 p-4 rounded-lg text-left"
          >
            <p className="text-gray-300">
              <span className="font-semibold text-white">Connected Account:</span>
              <br />
              <span className="text-yellow-400">{formatAddress(account)}</span>
            </p>
          </motion.div>
        )}

        {/* Placeholder contract call */}
        <button
          onClick={() => alert("Check Unlock Time logic not implemented.")}
          className={`w-full ${account ? "bg-green-500 hover:bg-green-600" : "bg-gray-500 cursor-not-allowed"} text-white font-semibold py-3 rounded-full transition transform hover:scale-105`}
          disabled={!account}
        >
          Check Unlock Time
        </button>
      </motion.div>
    </div>
  );
}
