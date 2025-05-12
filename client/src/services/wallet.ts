import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  console.log("Connected account:", accounts[0]);
  
  const signer = await provider.getSigner();

  return {
    address: await signer.getAddress(),
    signer,
    provider,
  };
}

export async function getCurrentWallet() {
  if (!window.ethereum) return null;

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const accounts = await provider.listAccounts();

  if (accounts.length === 0) return null;

  const signer = await provider.getSigner();

  return {
    address: await signer.getAddress(),
    signer,
    provider,
  };
}
