/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ethers } from "ethers"; 
import axios from "axios";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";

type Transaction = {
  _id?: string;
  type: "Send" | "Receive" | "Swap";
  amount: string;
  to?: string;
  from?: string;
  time?: string;
  tokenSymbol?: string;
  txHash?: string;
  details?: string;
};

const Trade = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [sendTo, setSendTo] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const [swapTo, setSwapTo] = useState<"USDC" | "DAI">("USDC");
  const [swapAmount, setSwapAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!walletAddress || !sendTo || !amountToSend) {
      setError("Please fill in all fields for sending ETH");
      return;
    }
    setIsSending(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/trade/send`,
        {
          to: sendTo,
          amount: amountToSend,
          walletAddress,
        }
      );
      setRecentTransactions((prev) => [
        {
          type: "Send",
          amount: `-${amountToSend} ETH`,
          to: sendTo,
          time: new Date().toLocaleString(),
          txHash: res.data.txHash,
        },
        ...prev,
      ]);
      setSendTo("");
      setAmountToSend("");
      setError(null);
    } catch (err: any) {
      console.error("Send failed", err);
      setError(err.response?.data?.error || "Failed to send ETH");
    } finally {
      setIsSending(false);
    }
  };

  const handleSwap = async () => {
    if (!walletAddress || !swapAmount || !swapTo) {
      setError("Please fill in all fields for swapping tokens");
      return;
    }
    setIsSwapping(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/trade/swap`,
        {
          fromToken: "ETH",
          toToken: swapTo,
          amount: swapAmount,
          walletAddress,
        }
      );
      setRecentTransactions((prev) => [
        {
          type: "Swap",
          amount: `${swapAmount} ETH → ${swapTo}`,
          time: new Date().toLocaleString(),
          txHash: res.data.txHash,
        },
        ...prev,
      ]);
      setSwapAmount("");
      setError(null);
    } catch (err: any) {
      console.error("Swap failed", err);
      setError(err.response?.data?.error || "Failed to swap tokens");
    } finally {
      setIsSwapping(false);
    }
  };

  useEffect(() => {
    const connectWallet = async () => {
      const ethereum = window.ethereum;
      if (!ethereum || typeof ethereum.request !== "function") {
        setError("No Ethereum provider detected. Please install MetaMask.");
        return;
      }

      try {
        const accounts = (await ethereum.request({
          method: "eth_requestAccounts",
          params: [],
        })) as string[];

        if (accounts.length === 0) {
          setError("No accounts found. Please connect your wallet.");
          return;
        }
        setWalletAddress(accounts[0]);

        const provider = new ethers.providers.Web3Provider(ethereum);
        const bal = await provider.getBalance(accounts[0]);
        setBalance(ethers.utils.formatEther(bal));

        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/trade/${accounts[0]}/transactions`
        );

        if (Array.isArray(res.data)) {
          setRecentTransactions(
            res.data.map((t: any) => ({
              ...t,
              time: new Date(t.timestamp).toLocaleString(),
              amount:
                t.type === "Send"
                  ? `-${t.amount} ${t.tokenSymbol}`
                  : `${t.amount} ${t.tokenSymbol}`,
            }))
          );
        } else {
          console.error("Expected an array but received", res.data);
          setError("Failed to fetch transactions");
        }
      } catch (err: any) {
        console.error("Wallet or transaction fetch error", err);
        setError(err.message || "Failed to connect wallet or fetch data");
      }
    };

    connectWallet();
  }, []);


  return (
    <div className="min-h-screen text-white px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold text-yellow-400 mb-8 text-center"
      >
        Trade
      </motion.h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Wallet Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-2xl p-6 shadow-lg mb-10 max-w-4xl mx-auto"
      >
        <p className="text-xl mb-2">Connected Wallet:</p>
        <div className="bg-gray-700 p-4 rounded-lg font-mono break-all mb-4">
          {walletAddress || "Connecting..."}
        </div>
        <p className="text-xl">Balance:</p>
        <div className="text-4xl font-bold text-green-400">
          {parseFloat(balance).toFixed(4)} ETH
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
        {/* Send */}
        <motion.div
          className="bg-gray-800 p-6 rounded-xl shadow-xl space-y-4 w-full sm:w-1/3 max-w-md"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-2xl text-yellow-300 font-bold">Send ETH</h2>
          <input
            placeholder="Recipient Address"
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
            value={sendTo}
            onChange={(e) => setSendTo(e.target.value)}
          />
          <input
            placeholder="Amount (ETH)"
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
            value={amountToSend}
            onChange={(e) => setAmountToSend(e.target.value)}
          />
          <button
            onClick={handleSend}
            disabled={isSending}
            className={`w-full bg-yellow-500 py-3 rounded-lg font-bold ${isSending ? "opacity-50" : "hover:scale-105"} transition`}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </motion.div>

        {/* Receive */}
        <motion.div
          className="bg-gray-800 p-6 rounded-xl shadow-xl text-center w-full sm:w-1/3 max-w-md"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-2xl text-green-300 font-bold">Receive ETH</h2>
          {walletAddress && (
            <QRCode
              value={walletAddress}
              className="my-6 mx-auto"
              size={100}
              bgColor="#1f2937"
              fgColor="#facc15"
            />
          )}
          <p className="mt-3 text-gray-400 break-all">{walletAddress}</p>
        </motion.div>

        {/* Swap */}
        <motion.div
          className="bg-gray-800 p-6 rounded-xl shadow-xl space-y-4 w-full sm:w-1/3 max-w-md"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-2xl text-purple-300 font-bold">Swap ETH</h2>
          <input
            placeholder="Amount (ETH)"
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
            value={swapAmount}
            onChange={(e) => setSwapAmount(e.target.value)}
          />
          <select
            className="w-full p-3 rounded-lg bg-gray-700 text-white"
            value={swapTo}
            onChange={(e) => setSwapTo(e.target.value as "USDC" | "DAI")}
          >
            {["USDC", "DAI"].map((sym) => (
              <option key={sym}>{sym}</option>
            ))}
          </select>
          <button
            onClick={handleSwap}
            disabled={isSwapping}
            className={`w-full bg-purple-600 py-3 rounded-lg font-bold ${isSwapping ? "opacity-50" : "hover:scale-105"} transition`}
          >
            {isSwapping ? "Swapping..." : "Swap"}
          </button>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-semibold text-yellow-300 mb-6">
          Recent Transactions
        </h2>
        <div className="space-y-4">
          {recentTransactions.length ? (
            recentTransactions.map((tx, i) => (
              <motion.div
                key={i}
                className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <p className="font-semibold">{tx.type}</p>
                  <p className="text-gray-400 text-sm">{tx.time}</p>
                </div>
                <div className="text-right">
                  <p
                    className={
                      tx.type === "Send" ? "text-red-400" : "text-green-400"
                    }
                  >
                    {tx.amount}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {tx.to || tx.from || tx.tokenSymbol}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trade;
