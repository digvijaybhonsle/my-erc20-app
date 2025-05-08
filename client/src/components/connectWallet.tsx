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
    <div>
      <button onClick={handleConnect}>Connect Wallet</button>
      <p>Connected Account: {account}</p>
      <button onClick={callContract}>Check Unlock Time</button>
    </div>
  );
}
