import { useState } from "react";
import { connectWallet } from "../services/wallet";
// import { getContract } from "../services/contarct";

export default function App() {
  const [account, setAccount] = useState("");

  const handleConnect = async () => {
    const { address } = await connectWallet();
    setAccount(address);
  };

  const callContract = async () => {
    // const contract = await getContract();
    // const unlockTime = await contract.unlockTime(); // Example read call
    // console.log("Unlock Time:", unlockTime.toString());
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="bg-gray-700 bg-opacity-60 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-md w-full text-center text-white py-10 px-10">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 animate-fade-in">
          Join Your Wallet
        </h2>

        <button
          onClick={handleConnect}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105 mb-4"
        >
          Connect Wallet
        </button>

        {account && (
          <div className="bg-gray-800 p-8 rounded-lg mb-4">
            <p className="text-gray-300">
              <span className="font-semibold text-white">
                Connected Account:
              </span>
              <br />
              {account}
            </p>
          </div>
        )}

        <button
          onClick={callContract}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full transition duration-300 transform hover:scale-105"
        >
          Check Unlock Time
        </button>
      </div>
    </div>
  );
}
