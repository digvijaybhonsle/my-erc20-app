import { useEffect, useState } from "react";
import { BrowserProvider, formatEther, parseEther } from "ethers";
import type { Eip1193Provider } from "ethers";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";

type Transaction = {
  id: number;
  type: "Send" | "Receive" | "Swap";
  amount: string;
  to?: string;
  from?: string;
  time: string;
};

declare global {
  interface Window {
    ethereum?: {
      request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const Trade = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [sendTo, setSendTo] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const [swapTo, setSwapTo] = useState<"ETH" | "USDC" | "DAI">("USDC");
  const [swapAmount, setSwapAmount] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  // Fetch wallet & balance
  useEffect(() => {
    (async () => {
      const eth = window.ethereum;
      if (eth?.request) {
        try {
          const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
          setWalletAddress(accounts[0]);

          const provider = new BrowserProvider(eth as Eip1193Provider);
          const bal = await provider.getBalance(accounts[0]);
          setBalance(formatEther(bal));
        } catch {
          console.error("Wallet fetch error");
        }
      }
    })();
  }, []);

  // Send ETH
  const handleSend = async () => {
    if (!window.ethereum?.request) return;
    setIsSending(true);
    try {
      const provider = new BrowserProvider(window.ethereum as Eip1193Provider);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: sendTo,
        value: parseEther(amountToSend),
      });
      await tx.wait();
      setRecentTransactions((prev) => [
        { id: Date.now(), type: "Send", amount: `-${amountToSend} ETH`, to: sendTo, time: "Just now" },
        ...prev,
      ]);
      setSendTo("");
      setAmountToSend("");
    } catch {
      console.error("Send Error");
    } finally {
      setIsSending(false);
    }
  };

  // Swap ETH → swapTo
  const handleSwap = async () => {
    if (!window.ethereum?.request) return;
    setIsSwapping(true);
    try {
      // Swap logic placeholder—replace with contract call
      await new Promise((r) => setTimeout(r, 1000));
      setRecentTransactions((prev) => [
        { id: Date.now(), type: "Swap", amount: `${swapAmount} ETH → ${swapTo}`, time: "Just now" },
        ...prev,
      ]);
      setSwapAmount("");
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="min-h-screen text-white px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold text-yellow-400 mb-8 text-center"
      >
        My Wallet
      </motion.h1>

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
          className="bg-gray-800 p-6 rounded-xl shadow-xl space-y-4 w-full max-w-md"
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
            className={`w-full bg-yellow-500 py-3 rounded-lg font-bold ${
              isSending ? "opacity-50" : "hover:scale-105"
            } transition`}
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </motion.div>

        {/* Receive */}
        <motion.div
          className="bg-gray-800 p-6 rounded-xl shadow-xl text-center w-full max-w-md"
          whileHover={{ scale: 1.02 }}
        >
          <h2 className="text-2xl text-green-300 font-bold">Receive ETH</h2>
          {walletAddress && (
            <QRCode value={walletAddress} className="my-6" style={{marginLeft: "150px"}} size={100} bgColor="#1f2937" fgColor="#facc15" />
          )}
          <p className="mt-3 text-gray-400 break-all">{walletAddress}</p>
        </motion.div>

        {/* Swap */}
        <motion.div
          className="bg-gray-800 p-6 rounded-xl shadow-xl space-y-4 w-full max-w-md"
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
            onChange={(e) => setSwapTo(e.target.value as "ETH" | "USDC" | "DAI")}
          >
            {["ETH", "USDC", "DAI"].map((sym) => (
              <option key={sym}>{sym}</option>
            ))}
          </select>
          <button
            onClick={handleSwap}
            disabled={isSwapping}
            className={`w-full bg-purple-600 py-3 rounded-lg font-bold ${
              isSwapping ? "opacity-50" : "hover:scale-105"
            } transition`}
          >
            {isSwapping ? "Swapping..." : "Swap"}
          </button>
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-semibold text-yellow-300 mb-6">Recent Transactions</h2>
        <div className="space-y-4">
          {recentTransactions.length ? (
            recentTransactions.map((tx) => (
              <motion.div
                key={tx.id}
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
                  <p className={tx.type === "Send" ? "text-red-400" : "text-green-400"}>
                    {tx.amount}
                  </p>
                  <p className="text-gray-500 text-sm">{tx.to || tx.from}</p>
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
