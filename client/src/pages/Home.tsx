/* eslint-disable @typescript-eslint/no-explicit-any */
import box from "../assets/boximg.svg";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const COINS = [
  { name: "Bitcoin", symbol: "BTC" },
  { name: "Ethereum", symbol: "ETH" },
  { name: "Solana", symbol: "SOL" },
];

const Home = () => {
  const [prices, setPrices] = useState<Record<string, number | null>>({
    BTC: null,
    ETH: null,
    SOL: null,
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/dashboard/prices`)
      .then((res) => setPrices(res.data))
      .catch(console.error);
  }, []);

  const formatPrice = (price: number | null) =>
    price !== null ? `$${price.toLocaleString()}` : "Loading...";

  return (
    <div className="lg:px-[8rem]">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 xl:px-[8rem] pt-24 pb-36 md:pt-28 md:pb-40">
        {/* Text Section */}
        <div className="flex flex-col justify-center items-start w-full md:w-1/2 mb-12 md:mb-0 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-500 mb-4">
            Welcome to Smart Wallet
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-2">
            Simple, Smart and trusted way to learn Crypto
          </p>
          <p className="text-base sm:text-lg text-gray-300 mt-4">
            New to crypto? Start with our easy-to-use wallet designed for
            beginners and curious minds. Send, receive, and explore blockchain
            with confidence.
          </p>
          <div className="mt-6">
            <Link
              to="/join-wallet"
              className="bg-blue-500 text-base sm:text-lg md:text-xl text-white px-6 py-3 rounded-full transition duration-200 ease-in-out transform hover:bg-blue-600 hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative bg-gradient-to-br from-yellow-500/20 to-yellow-700/10 p-4 rounded-full max-w-[80%] md:max-w-[70%] cursor-pointer backdrop-blur-md">
            <img
              src={box}
              alt="Illustration of Smart Wallet"
              className="transition-transform duration-500 ease-in-out transform hover:scale-105 animate-float"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="flex flex-col items-center text-left px-6 py-12 rounded-xl shadow-md">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-10">
          Explore Our Features
        </h1>
        <div className="text-gray-300 space-y-4 max-w-xl text-xl">
          <div className="flex items-center">
            🚀 <span className="ml-2">Send and receive crypto easily</span>
          </div>
          <div className="flex items-center">
            💸 <span className="ml-2">No gas fees for beginners</span>
          </div>
          <div className="flex items-center">
            📊 <span className="ml-2">Track your tokens in real-time</span>
          </div>
          <div className="flex items-center">
            📚{" "}
            <span className="ml-2">
              Learn and transact without the complexity
            </span>
          </div>
          <div className="flex items-center">
            🤝{" "}
            <span className="ml-2">Join a community of crypto enthusiasts</span>
          </div>
        </div>
      </div>

      {/* Core Features Cards */}
      {/* First Section (Grid of 4 Items) */}
      <div className="mt-10 px-6 text-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 text-center px-4 py-12 bg-black-300 mt-20">
          {[
            {
              title: "Buy & Transfer Crypto Securely",
              desc: "Send and receive cryptocurrency safely into your Nexxo wallet.",
            },
            {
              title: "Borrow Instantly, No Credit Checks",
              desc: "Access loans instantly without paperwork or traditional banks.",
            },
            {
              title: "Spend Crypto Without Selling",
              desc: "Use your crypto for purchases while holding onto its value.",
            },
            {
              title: "500+ Pairs, Zero Fees",
              desc: "Trade across markets instantly with zero transaction fees.",
            },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`bg-gray-600 bg-opacity-30 p-6 shadow-md min-h-[200px] flex flex-col justify-center ${
                i === 0
                  ? "rounded-l-xl border-r-2"
                  : i === 3
                  ? "rounded-r-xl"
                  : "border-r-2"
              }`}
            >
              <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
                {item.title}
              </h2>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Learn / Swap Section */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 mt-12 px-6 min-h-[200px]">
        <div className="bg-gray-600 bg-opacity-30 p-6 rounded-l-lg shadow-md text-center border-r-2 flex flex-col justify-center items-center">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            Know about Crypto
          </h2>
          <Link
            to="/dashboard"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium px-6 py-2 rounded-full transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Explore →
          </Link>
        </div>
        <div className="bg-gray-600 bg-opacity-30 p-6 rounded-r-lg shadow-md text-center flex flex-col justify-center items-center">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            Swap Crypto for Free
          </h2>
          <Link
            to="/dashboard"
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium px-6 py-2 rounded-full transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Swap →
          </Link>
        </div>
      </div>

      {/* Live Market Section */}
      <div className="mt-16 px-6 text-xl">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Live Crypto Market
        </h2>
        <div className="bg-gray-700 bg-opacity-40 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-white mt-10 px-4">
            {COINS.map(({ name, symbol }, i) => (
              <div
                key={symbol}
                className={`bg-gray-700 p-6 shadow flex flex-col justify-center items-center ${
                  i === 0
                    ? "rounded-l-lg border-r-2"
                    : i === 2
                    ? "rounded-r-lg"
                    : "border-r-2"
                }`}
              >
                <h3 className="text-2xl font-semibold mb-3">
                  {name} ({symbol})
                </h3>
                <p className="mb-1">Price: {formatPrice(prices[symbol])}</p>
                <p>Market Cap: Coming soon</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learn Articles Section */}
      <div className="mt-20 px-6 mb-20">
        <h2 className="text-3xl font-bold text-yellow-400 mb-10 text-center">
          Learn About Crypto
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white text-xl">
          {[
            {
              title: "What is Blockchain?",
              desc: "Understand how blockchain works and why it matters in modern finance.",
              url: "https://www.investopedia.com/terms/b/blockchain.asp",
            },
            {
              title: "Getting Started with Crypto",
              desc: "Begin your crypto journey with our beginner-friendly guides.",
              url: "https://www.kaspersky.com/resource-center/definitions/what-is-cryptocurrency",
            },
            {
              title: "Crypto Safety Tips",
              desc: "Learn best practices to keep your crypto assets safe and secure.",
              url: "https://www.eccu.edu/blog/cybersecurity/cryptocurrency-cybersecurity-how-to-store-your-crypto-safely/",
            },
          ].map((article) => (
            <div
              key={article.title}
              className="bg-gray-700 bg-opacity-30 p-6 rounded-lg shadow-md flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <h3 className="text-2xl font-semibold mb-3">{article.title}</h3>
                <p className="mb-4">{article.desc}</p>
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-400 hover:underline mt-auto"
              >
                Read more →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
