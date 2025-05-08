import box from "../assets/boximg.svg";

const Home = () => {
  return (
    <div>
      <div
        className="flex h-full"
        style={{ paddingTop: "100px", paddingBottom: "150px" }}
      >
        <div className="flex flex-col justify-center items-start w-1/2 px-10">
          <h1
            className="text-5xl font-bold text-left mt-10 text-yellow-500 my-4"
            style={{ padding: "50px 0 8px 0" }}
          >
            Welcome to Smart Wallet
          </h1>
          <p className="text-2xl text-left" style={{ padding: "25px 0 5px 0" }}>
            Simple, Smart and trusted way to learn Crypto
          </p>
          <p
            className="text-lg text-left mt-4"
            style={{ padding: "2px 0 5px 0" }}
          >
            New to crypto? Start with our easy-to-use wallet designed for
            beginners and curious minds. Send, receive, and explore blockchain
            with confidence.
          </p>
          <div
            className="flex justify-left mt-6"
            style={{ padding: "25px 0 5px 0" }}
          >
            <a
              href="#"
              className="bg-blue-500 text-xl text-gray-200 px-4 py-2 rounded-full transition duration-200 ease-in-out transform hover:bg-blue-600 hover:scale-105 hover:shadow-lg"
              style={{ padding: "16px 12px 16px 12px" }}
            >
              Get Started
            </a>
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <div
            className="relative bg-gradient-to-br from-yellow-500/20 to-yellow-700/10 p-4 rounded-full"
            style={{
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              height: "auto",
              width: "100%",
              maxWidth: "80%",
              cursor: "pointer"
            }}
          >
            <img
              src={box}
              alt="Hero"
              className="absolute inset-0 m-auto w-3/4 md:w-2/3 h-auto opacity-90 transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>
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
      <div className="mt-10 px-6 text-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 text-center px-4 py-12 bg-black-300 mt-20">
          <div className="bg-gray-600 bg-opacity-30 p-6 rounded-l-xl shadow-lg border-r-2 min-h-[200px] flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
              Buy & Transfer Crypto Securely
            </h2>
            <p className="text-gray-300">
              Send and receive cryptocurrency safely into your Nexxo wallet.
            </p>
          </div>

          <div className="bg-gray-600 bg-opacity-30 p-6 rounded-none shadow-md border-r-2 min-h-[200px] flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
              Borrow Instantly, No Credit Checks
            </h2>
            <p className="text-gray-300">
              Access loans instantly without paperwork or traditional banks.
            </p>
          </div>

          <div className="bg-gray-600 bg-opacity-30 p-6 rounded-none shadow-md border-r-2 min-h-[200px] flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
              Spend Crypto Without Selling
            </h2>
            <p className="text-gray-300">
              Use your crypto for purchases while holding onto its value.
            </p>
          </div>

          <div className="bg-gray-600 bg-opacity-30 p-6 rounded-r-xl shadow-md min-h-[200px] flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-2">
              500+ Pairs, Zero Fees
            </h2>
            <p className="text-gray-300">
              Trade across markets instantly with zero transaction fees.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-12 px-6 min-h-[200px]">
        <div className="bg-gray-600 bg-opacity-30 p-6 rounded-l-lg shadow-md text-center border-r-2 flex flex-col justify-center items-center">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            Know about Crypto
          </h2>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium px-6 py-2 rounded-full transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
            Explore →
          </button>
        </div>

        <div className="bg-gray-600 bg-opacity-30 p-6 rounded-r-lg shadow-md text-center flex flex-col justify-center items-center">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
            Swap Crypto for Free
          </h2>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium px-6 py-2 rounded-full transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-lg">
            Swap →
          </button>
        </div>
      </div>
      <div className="mt-16 px-6 text-xl">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          Live Crypto Market
        </h2>
        <div className="bg-gray-700 bg-opacity-40 p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-white mt-10 px-4">
            <div className="bg-gray-700 p-6 rounded-l-lg shadow flex flex-col justify-center items-center border-r-2">
              <h3 className="text-2xl font-semibold mb-3">Bitcoin (BTC)</h3>
              <p className="mb-1">Price: $50,000</p>
              <p>Market Cap: $1T</p>
            </div>

            <div className="bg-gray-700 p-6 rounded-none shadow flex flex-col justify-center items-center border-r-2">
              <h3 className="text-2xl font-semibold mb-3">Ethereum (ETH)</h3>
              <p className="mb-1">Price: $3,000</p>
              <p>Market Cap: $400B</p>
            </div>

            <div className="bg-gray-700 p-6 rounded-r-lg shadow flex flex-col justify-center items-center">
              <h3 className="text-2xl font-semibold mb-3">Solana (SOL)</h3>
              <p className="mb-1">Price: $27,000</p>
              <p>Market Cap: $800B</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 px-6 mb-20">
        <h2 className="text-3xl font-bold text-yellow-400 mb-10 text-center">
          Learn About Crypto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white text-xl">
          <div className="bg-gray-700 bg-opacity-30 p-6 rounded-lg shadow-md flex flex-col justify-between min-h-[220px]">
            <div>
              <h3 className="text-2xl font-semibold mb-3">
                What is Blockchain?
              </h3>
              <p className="mb-4">
                Understand how blockchain works and why it matters in modern
                finance.
              </p>
            </div>
            <a
              href="https://www.investopedia.com/terms/b/blockchain.asp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:underline mt-auto"
            >
              Read more →
            </a>
          </div>

          <div className="bg-gray-700 bg-opacity-30 p-6 rounded-lg shadow-md flex flex-col justify-between min-h-[220px]">
            <div>
              <h3 className="text-2xl font-semibold mb-3">
                Getting Started with Crypto
              </h3>
              <p className="mb-4">
                Begin your crypto journey with our beginner-friendly guides.
              </p>
            </div>
            <a
              href="https://www.coinbase.com/learn/crypto-basics/what-is-cryptocurrency"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:underline mt-auto"
            >
              Read more →
            </a>
          </div>

          <div className="bg-gray-700 bg-opacity-30 p-6 rounded-lg shadow-md flex flex-col justify-between min-h-[220px]">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Crypto Safety Tips</h3>
              <p className="mb-4">
                Learn best practices to keep your crypto assets safe and secure.
              </p>
            </div>
            <a
              href="https://www.coinbase.com/learn/tips-and-tutorials/how-to-keep-your-crypto-safe"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 hover:underline mt-auto"
            >
              Read more →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
