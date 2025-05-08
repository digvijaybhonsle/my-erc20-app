
const Wallet = () => {
  const dummyBalance = "2.45 ETH";
  const dummyAddress = "0x1234...abcd";
  const recentTransactions = [
    { id: 1, type: "Send", amount: "-0.5 ETH", to: "0xabcd...1234", time: "2 hrs ago" },
    { id: 2, type: "Receive", amount: "+1.2 ETH", from: "0x9876...abcd", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen text-white px-6 py-12">
      {/* Header */}
      <h1 className="text-5xl font-bold text-yellow-400 mb-8 text-center">My Wallet</h1>

      {/* Wallet Info */}
      <div className="bg-gray-800 rounded-2xl p-6 shadow-lg mb-10 max-w-4xl mx-auto">
        <p className="text-xl mb-2">Connected Wallet:</p>
        <div className="bg-gray-700 p-4 rounded-lg text-md font-mono break-all mb-4">
          {dummyAddress}
        </div>
        <p className="text-xl">Balance:</p>
        <div className="text-4xl font-bold text-green-400">{dummyBalance}</div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
        <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-full font-medium transition duration-200 hover:scale-105">
          Send
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition duration-200 hover:scale-105">
          Receive
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full font-medium transition duration-200 hover:scale-105">
          Swap
        </button>
      </div>

      {/* Transactions */}
      <div className="max-w-4xl mx-auto text-2xl">
        <h2 className="text-4xl font-semibold text-yellow-300 mb-8">Recent Transactions</h2>
        <div className="space-y-4">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-gray-800 p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{tx.type}</p>
                <p className="text-md text-gray-400">{tx.time}</p>
              </div>
              <div className="text-right">
                <p className="text-green-400">{tx.amount}</p>
                <p className="text-sm text-gray-500">{tx.to || tx.from}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
