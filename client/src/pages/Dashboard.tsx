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

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

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

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold text-yellow-400 mb-2 animate-fade-in">
          Dashboard
        </h1>
        <p className="text-gray-400 animate-fade-in delay-100 text-xl">
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
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg animate-slide-in-left h-full flex flex-col justify-between min-h-[600px]">
          {/* Swap To Dropdown */}
          <div className="mb-6">
            <label className="block text-2xl text-white mb-2 font-semibold">
              Swap To
            </label>
            <select className="bg-gray-700 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 text-xl text-white px-2">
              <option>ETH</option>
              <option>USDC</option>
              <option>DAI</option>
            </select>
          </div>

          {/* Token Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search token"
              className="w-full p-3 rounded-lg text-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Balances */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between bg-gray-700 p-5 rounded-xl text-white text-lg font-medium hover:scale-105 transition-transform">
              <span>ETH Balance</span>
              <span className="text-yellow-400">0.00</span>
            </div>
            <div className="flex items-center justify-between bg-gray-700 p-5 rounded-xl text-white text-lg font-medium hover:scale-105 transition-transform">
              <span>USDC Balance</span>
              <span className="text-yellow-400">0.00</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gray-700 p-5 rounded-xl text-white mb-6">
            <h2 className="text-2xl font-semibold mb-3 text-yellow-400">
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
                Price Impact: <span className="text-yellow-400">0.0%</span>
              </p>
            </div>
          </div>

          {/* Swap Button */}
          <div className="mt-auto">
            <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 active:scale-95">
              Swap
            </button>
          </div>
        </div>

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
              <li className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition">
                Swapped 0.5 ETH to USDC
              </li>
              <li className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition">
                Received 200 DAI
              </li>
              <li className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition">
                Sent 50 USDT
              </li>
              <li className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition">
                Swapped 1 ETH to DAI
              </li>
              <li className="bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition">
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
