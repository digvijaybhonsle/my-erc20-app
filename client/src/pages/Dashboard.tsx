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
      request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const Dashboard = () => {
  // Chart state
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartPrices, setChartPrices] = useState<number[]>([]);

  // Balances
  const [ethBalance, setEthBalance] = useState("0.00");
  const [usdcBalance, setUsdcBalance] = useState("0.00");
  const [daiBalance, setDaiBalance] = useState("0.00");

  // Live prices
  const [livePrices, setLivePrices] = useState<{ BTC: string; ETH: string; SOL: string }>({
    BTC: "--",
    ETH: "--",
    SOL: "--",
  });

  // Swap form
  const [swapTo, setSwapTo] = useState("USDC");
  const [amount, setAmount] = useState("");

  // Estimate info
  const [receivedAmount, setReceivedAmount] = useState("—");
  const [gasFee, setGasFee] = useState("—");
  const [priceImpact, setPriceImpact] = useState("—");

  // Wallet
  const [walletAddress, setWalletAddress] = useState("");

  // 1. Get wallet from MetaMask
  useEffect(() => {
    (async () => {
      const eth = window.ethereum;
      if (eth?.request) {
        try {
          const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
          setWalletAddress(accounts[0]);
        } catch {
          console.warn("User denied wallet access");
        }
      }
    })();
  }, []);

  // 2. Fetch balances when walletAddress is set
  useEffect(() => {
    if (!walletAddress) return;
    axios
      .get(`/api/dashboard/balances/${walletAddress}`)
      .then((res) => {
        setEthBalance(res.data.eth);
        setUsdcBalance(res.data.usdc);
        setDaiBalance(res.data.dai);
      })
      .catch(console.error);
  }, [walletAddress]);

  // 3. Fetch live market prices once
  useEffect(() => {
    axios
      .get("/api/dashboard/prices")
      .then((res) => setLivePrices(res.data))
      .catch(console.error);
  }, []);

  // 4. Fetch price history for chart
  useEffect(() => {
    axios
      .get("/api/dashboard/price-history", { params: { symbol: "ETHUSDT", range: 7 } })
      .then((res) => {
        setChartLabels(res.data.labels);
        setChartPrices(res.data.prices);
      })
      .catch(console.error);
  }, []);

  // 5. Re-estimate on swap form changes
  useEffect(() => {
    if (!amount) return;
    axios
      .post("/api/dashboard/estimate", { fromToken: "ETH", toToken: swapTo, amount })
      .then((res) => {
        setReceivedAmount(res.data.receivedAmount);
        setGasFee(res.data.gasFee);
        setPriceImpact(res.data.priceImpact);
      })
      .catch(console.error);
  }, [amount, swapTo]);

  // Handlers
  const handleSwap = () => {
    axios
      .post("/api/dashboard/swap", { fromToken: "ETH", toToken: swapTo, amount, walletAddress })
      .then(() => {
        // refresh balances after swap
        return axios.get(`/api/dashboard/balances/${walletAddress}`);
      })
      .then((res) => {
        setEthBalance(res.data.eth);
        setUsdcBalance(res.data.usdc);
        setDaiBalance(res.data.dai);
      })
      .catch(console.error);
  };

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: "ETH Price",
        data: chartPrices,
        borderColor: "#facc15",
        backgroundColor: "rgba(250,204,21,0.2)",
        tension: 0.4,
        pointBackgroundColor: "#facc15",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: { duration: 1500, easing: "easeOutQuart" as const },
    plugins: {
      legend: { labels: { color: "#facc15", font: { size: 14 } } },
      tooltip: { backgroundColor: "#1f2937", titleColor: "#facc15", bodyColor: "#f9fafb" },
    },
    scales: {
      x: { ticks: { color: "#d1d5db" }, grid: { color: "rgba(255,255,255,0.1)" } },
      y: { ticks: { color: "#d1d5db" }, grid: { color: "rgba(255,255,255,0.1)" } },
    },
  };

  return (
    <div className="min-h-screen text-white px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-yellow-500 mb-2">Dashboard</h1>
        <p className="text-gray-400 text-xl mb-4">Manage your wallet and transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Panel */}
        <motion.div
          className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Swap Form */}
          <div className="space-y-4">
            <label className="text-2xl font-semibold">Swap To</label>
            <select
              className="w-full p-3 bg-gray-700 text-white rounded-lg"
              value={swapTo}
              onChange={(e) => setSwapTo(e.target.value)}
            >
              <option>USDC</option>
              <option>DAI</option>
            </select>
            <input
              className="w-full p-3 bg-gray-700 text-white rounded-lg"
              placeholder="Amount ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Balances */}
          <div className="space-y-2 mt-6">
            <div className="flex justify-between">
              <span>ETH Balance</span>
              <span className="text-yellow-400">{ethBalance}</span>
            </div>
            <div className="flex justify-between">
              <span>USDC Balance</span>
              <span className="text-yellow-400">{usdcBalance}</span>
            </div>
            <div className="flex justify-between">
              <span>DAI Balance</span>
              <span className="text-yellow-400">{daiBalance}</span>
            </div>
          </div>

          {/* More Info */}
          <div className="bg-gray-700 p-4 rounded-lg mt-6">
            <h2 className="text-xl font-semibold text-yellow-500 mb-2">More Information</h2>
            <p>Received: <span className="text-green-400">{receivedAmount}</span></p>
            <p>Gas Fee: <span className="text-red-400">{gasFee}</span></p>
            <p>Price Impact: <span className="text-yellow-500">{priceImpact}</span></p>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleSwap}
            className="w-full bg-yellow-500 py-3 rounded-lg text-gray-900 font-bold mt-6 hover:scale-105 transition"
          >
            Swap
          </button>
        </motion.div>

        {/* Right Panel */}
        <div className="space-y-8">
          {/* Live Prices */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Live Prices</h2>
            <div className="grid grid-cols-3 gap-4 text-center text-white">
              {(["BTC", "ETH", "SOL"] as const).map((sym) => (
                <div key={sym} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-xl">{sym}</h3>
                  <p className="mt-2">${livePrices[sym] || "—"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Price History</h2>
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
