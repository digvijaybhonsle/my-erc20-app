// server/src/controllers/tradeController.ts
import { RequestHandler } from "express";
// import { wallet, provider } from "../web3Provider";
import TradeModel, { ITrade } from "../db/models/trade";
import { ethers } from "ethers";
import LockArtifact from "../../abi/Lock.json";


// Initialize provider and wallet (configure via environment variables)
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL || "YOUR_PROVIDER_URL");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "YOUR_PRIVATE_KEY", provider);

export const sendETH: RequestHandler = async (req, res) => {
  const { to, amount, walletAddress } = req.body as {
    to: string;
    amount: string;
    walletAddress: string;
  };

  try {
    // Validate inputs
    if (!ethers.isAddress(to) || !ethers.isAddress(walletAddress)) {
      res.status(400).json({ error: "Invalid Ethereum address" });
      return;
    }
    let parsedAmount: bigint;
    try {
      parsedAmount = ethers.parseEther(amount);
    } catch {
      res.status(400).json({ error: "Invalid amount format" });
      return;
    }
    if (parsedAmount <= 0) {
      res.status(400).json({ error: "Amount must be greater than 0" });
      return;
    }

    // Send ETH transaction
    const signer = wallet.connect(provider);
    const tx = await signer.sendTransaction({
      to,
      value: parsedAmount,
    });
    await tx.wait();

    // Persist trade to database
    await TradeModel.create({
      walletAddress,
      type: "Send",
      details: `Sent ${amount} ETH to ${to}`,
      amount,
      tokenSymbol: "ETH",
      txHash: tx.hash,
    } as Partial<ITrade>);

    res.json({ success: true, txHash: tx.hash });
  } catch (err: any) {
    console.error("Error in sendETH:", err);
    if (err.code === "INSUFFICIENT_FUNDS") {
      res.status(400).json({ error: "Insufficient funds for transaction" });
      return;
    }
    if (err.code === "INVALID_ARGUMENT") {
      res.status(400).json({ error: "Invalid transaction parameters" });
      return;
    }
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};


// Swap contract configuration
const SWAP_CONTRACT_ADDRESS = process.env.SWAP_CONTRACT_ADDRESS!;
const SWAP_CONTRACT_ABI = [
  "function swap(address fromToken, address toToken, uint256 amount) external",
];

// ERC20 ABI for approval
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
];

// Initialize swap contract
const swapContract = new ethers.Contract(SWAP_CONTRACT_ADDRESS, SWAP_CONTRACT_ABI, wallet);

export const swapTokens: RequestHandler = async (req, res) => {
  const { fromToken, toToken, amount, walletAddress } = req.body as {
    fromToken: string;
    toToken: string;
    amount: string;
    walletAddress: string;
  };

  try {
    // Validate inputs
    if (!ethers.isAddress(fromToken) || !ethers.isAddress(toToken) || !ethers.isAddress(walletAddress)) {
      res.status(400).json({ error: "Invalid Ethereum address" });
      return;
    }
    let parsedAmount: bigint;
    try {
      parsedAmount = ethers.parseEther(amount); // Assumes amount is in ETH-like units; adjust for token decimals if needed
    } catch {
      res.status(400).json({ error: "Invalid amount format" });
      return;
    }
    if (parsedAmount <= 0) {
      res.status(400).json({ error: "Amount must be greater than 0" });
      return;
    }

    // Approve Swap contract to spend fromToken
    const fromTokenContract = new ethers.Contract(fromToken, ERC20_ABI, wallet);
    const signer = wallet.connect(provider);
    const allowance = await fromTokenContract.allowance(wallet.address, SWAP_CONTRACT_ADDRESS);
    if (allowance < parsedAmount) {
      const approveTx = await fromTokenContract.approve(SWAP_CONTRACT_ADDRESS, parsedAmount, {
        gasLimit: 100000,
      });
      await approveTx.wait();
    }

    // Execute swap transaction
    const tx = await swapContract.swap(fromToken, toToken, parsedAmount, {
      gasLimit: 200000,
    });
    const receipt = await tx.wait();

    // Persist trade to database
    await TradeModel.create({
      walletAddress,
      type: "Swap",
      details: `Swapped ${amount} from ${fromToken} to ${toToken}`,
      amount,
      tokenSymbol: "Unknown", // Replace with actual token symbol if available
      txHash: tx.hash,
    } as Partial<ITrade>);

    res.json({ success: true, txHash: tx.hash });
  } catch (err: any) {
    console.error("Error in swapTokens:", err);
    if (err.message.includes("swapContract.swap is not a function")) {
      res.status(500).json({ error: "Swap function not found in contract" });
      return;
    }
    if (err.code === "INSUFFICIENT_FUNDS") {
      res.status(400).json({ error: "Insufficient funds for transaction" });
      return;
    }
    if (err.code === "INVALID_ARGUMENT") {
      res.status(400).json({ error: "Invalid transaction parameters" });
      return;
    }
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};  

// 3. GET RECENT TRANSACTIONS
export const getRecentTransactions: RequestHandler = async (req, res) => {
  const address = req.params.address as string;
  try {
    const trades = await TradeModel.find({ walletAddress: address })
      .sort({ timestamp: -1 })
      .limit(20)
      .lean();
    res.json(trades);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
