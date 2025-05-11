import { Request, Response } from "express";
import { wallet, provider } from "../web3Provider"; 
import TradeModel, { ITrade } from "../db/models/trade";
import { ethers } from "ethers";
// Adjust path to where your ABI lives:
import SwapArtifact from "../abi/Swap.json";

interface SendETHBody {
  to: string;
  amount: string;
  walletAddress: string;
}

interface SwapBody {
  fromToken: string;
  toToken: string;
  amount: string;
  walletAddress: string;
}

// 1. SEND ETH
export const sendETH = async (req: Request<{}, {}, SendETHBody>, res: Response) => {
  const { to, amount, walletAddress } = req.body;
  try {
    const signer = wallet.connect(provider);
    const tx = await signer.sendTransaction({
      to,
      value: ethers.parseEther(amount),
    });
    await tx.wait();

    const trade: Partial<ITrade> = {
      walletAddress,
      type: "Send",
      details: `Sent ${amount} ETH to ${to}`,
      amount,
      tokenSymbol: "ETH",
      txHash: tx.hash,
      timestamp: new Date(),
    };
    await TradeModel.create(trade);

    res.json({ success: true, txHash: tx.hash });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 2. SWAP TOKENS
export const swapTokens = async (req: Request<{}, {}, SwapBody>, res: Response) => {
  const { fromToken, toToken, amount, walletAddress } = req.body;
  try {
    const signer = wallet.connect(provider);
    const swapContract = new ethers.Contract(
      process.env.SWAP_CONTRACT_ADDRESS!,  // ensure this is set in your .env
      (SwapArtifact as any).abi,           // pass only the ABI array
      signer
    );

    // Call your swap method (adjust args/order if needed)
    const tx = await swapContract.swap(
      fromToken,
      toToken,
      ethers.parseUnits(amount, 18)
    );
    await tx.wait();

    const trade: Partial<ITrade> = {
      walletAddress,
      type: "Swap",
      details: `Swapped ${amount} ${fromToken} → ${toToken}`,
      amount,
      tokenSymbol: fromToken,
      txHash: tx.hash,
      timestamp: new Date(),
    };
    await TradeModel.create(trade);

    res.json({ success: true, txHash: tx.hash });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 3. GET RECENT TRANSACTIONS
export const getRecentTransactions = async (req: Request<{ address: string }>, res: Response) => {
  const { address } = req.params;
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
