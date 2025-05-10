import { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

declare global {
  interface Window {
    ethereum?: {
      request?: (args: {
        method: string;
        params?: unknown[]; // ✅ use unknown instead of any
      }) => Promise<unknown>; // also preferable to return unknown
    };
  }
}

const Dashboard = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Crypto Price",
        data: [40, 45, 43, 47, 44, 48, 50],
        borderColor: "#facc15",
        backgroundColor: "rgba(250, 204, 21, 0.2)",
        tension: 0.4,
        pointBackgroundColor: "#facc15",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: {
      duration: 1500,
      easing: "easeOutQuart" as const,
    },
    plugins: {
      legend: {
        labels: {
          color: "#facc15",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#facc15",
        bodyColor: "#f9fafb",
      },
    },
    scales: {
      x: {
        ticks: { color: "#d1d5db" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "#d1d5db" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  const [ethBalance, setEthBalance] = useState("0.00");
  const [usdcBalance, setUsdcBalance] = useState("0.00");
  const [swapTo, setSwapTo] = useState("ETH");
  const [walletAddress, setWalletAddress] = useState("0x..."); // Replace with actual wallet or get from user context
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const res = await axios.get(`/api/wallet/balances/${walletAddress}`);
        setEthBalance(res.data.eth);
        setUsdcBalance(res.data.usdc);
      } catch (error) {
        console.error("Failed to fetch balances:", error);
      }
    };
    fetchBalances();
  }, [walletAddress]);

  useEffect(() => {
    const getWalletAddress = async () => {
      const ethereum = window.ethereum;
      if (ethereum && typeof ethereum.request === "function") {
        try {
          const accounts = (await ethereum.request({
            method: "eth_requestAccounts",
          })) as string[];
          setWalletAddress(accounts[0]);
        } catch (error) {
          console.error("Error fetching wallet address:", error);
        }
      } else {
        console.warn("MetaMask is not installed.");
      }
    };
    getWalletAddress();
  }, []);

  const handleBuy = () => {
    // navigate to trade page or open modal in buy mode
    console.log("Buy ETH clicked");
  };

  const handleSell = () => {
    // navigate to trade page or open modal in sell mode
    console.log("Sell ETH clicked");
  };

  const handleSwap = async () => {
    try {
      const res = await axios.post("/api/swap", {
        fromToken: "ETH", // Assuming ETH to something
        toToken: swapTo,
        amount,
        walletAddress,
      });
      console.log("Swap success:", res.data);
      // Optionally re-fetch balances
    } catch (error) {
      console.error("Swap failed:", error);
    }
  };

  return (
    <div className="min-h-screen text-white px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-yellow-500 mb-2 animate-fade-in my-6">
          Dashboard
        </h1>
        <p className="text-gray-400 animate-fade-in delay-100 text-xl my-6">
          Manage your wallet and transactions
        </p>
        <h2 className="mt-4 text-md text-gray-500 text-xl">
          Sepolia Testnet{" "}
          <a href="/" className="text-blue-400 underline hover:text-blue-300">
            Discover more
          </a>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section */}
        <motion.div
          className="bg-gray-800 p-6 rounded-xl shadow-lg h-full flex flex-col justify-between min-h-[600px]"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Swap To Dropdown */}
          <div className="mb-6">
            <label className="block text-2xl text-white mb-2 font-semibold">
              Swap To
            </label>
            <select
              className="bg-gray-700 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 text-xl text-white px-2"
              value={swapTo}
              onChange={(e) => setSwapTo(e.target.value)}
            >
              <option>ETH</option>
              <option>USDC</option>
              <option>DAI</option>
            </select>
          </div>

          {/* Token Search */}
          <input
            type="text"
            placeholder="Amount to swap"
            className="w-full p-3 rounded-lg text-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          {/* Balances */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between bg-gray-700 p-5 rounded-xl text-white text-lg font-medium hover:scale-105 transition-transform cursor-pointer">
              <span>ETH Balance</span>
              <span className="text-yellow-400">{ethBalance}</span>
            </div>
            <div className="flex items-center justify-between bg-gray-700 p-5 rounded-xl text-white text-lg font-medium hover:scale-105 transition-transform cursor-pointer">
              <span>USDC Balance</span>
              <span className="text-yellow-400">{usdcBalance}</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-700 p-5 rounded-xl text-white mb-6">
            <h2 className="text-2xl font-semibold mb-3 text-yellow-500">
              More Information
            </h2>
            <div className="space-y-2 text-lg">
              <p>
                Received Amount:{" "}
                <span className="text-green-400">$5.00 USD</span>
              </p>
              <p>
                Gas Fees: <span className="text-red-400">$0.00 USD</span>
              </p>
              <p>
                Price Impact: <span className="text-yellow-500">0.0%</span>
              </p>
            </div>
          </div>

          {/* Action Buttons: Buy / Sell / Swap */}
          <div className="flex flex-col space-y-4 mb-6">
            <motion.button
              onClick={handleBuy}
              className="w-full bg-green-500 hover:bg-green-600 text-gray-900 font-bold py-3 rounded-lg text-xl transition transform hover:scale-105"
              whileTap={{ scale: 0.95 }}
            >
              Buy ETH
            </motion.button>
            <motion.button
              onClick={handleSell}
              className="w-full bg-red-500 hover:bg-red-600 text-gray-200 font-bold py-3 rounded-lg text-xl transition transform hover:scale-105"
              whileTap={{ scale: 0.95 }}
            >
              Sell ETH
            </motion.button>
            <motion.button
              onClick={handleSwap}
              className="w-full bg-yellow-500 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-lg text-xl transition transform hover:scale-105"
              whileTap={{ scale: 0.95 }}
            >
              Swap
            </motion.button>
          </div>
        </motion.div>

        {/* Right Section */}
        <div className="space-y-8 animate-slide-in-right">
          {/* Graph */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg transform transition duration-500 hover:scale-[1.02] hover:shadow-2xl cursor-pointer">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 animate-pulse">
              Graph Plot
            </h2>
            <Line data={data} options={options} />
          </div>

          {/* Trade History */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Your Trade History</h2>
            <ul className="space-y-2 text-sm">
              <li className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 hover:scale-105 transition-transform cursor-pointer">
                Swapped 0.5 ETH to USDC
              </li>
              <li className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 hover:scale-105 transition-transform cursor-pointer">
                Received 200 DAI
              </li>
              <li className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 hover:scale-105 transition-transform cursor-pointer">
                Sent 50 USDT
              </li>
              <li className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 hover:scale-105 transition-transform cursor-pointer">
                Swapped 1 ETH to DAI
              </li>
              <li className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 hover:scale-105 transition-transform cursor-pointer">
                Received 500 USDC
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
