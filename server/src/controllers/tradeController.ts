import { Request, Response } from "express";
import { wallet, provider } from "../web3Provider"; // your ethers setup
// import SwapABI from "../abi/Swap.json";               // your swap contract ABI
import TradeModel, { ITrade } from "../db/models/trade"; // your Mongoose model

// 1. SEND ETH
export const sendETH = async (req: Request, res: Response) => {
  const { to, amount, walletAddress } = req.body as {
    to: string;
    amount: string;
    walletAddress: string;
  };

  const signer = wallet.connect(provider);
  try {
    const tx = await signer.sendTransaction({
      to,
      value: provider.format.parseEther(amount),
    });
    await tx.wait();

    // Save to DB
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
export const swapTokens = async (req: Request, res: Response) => {
  const { fromToken, toToken, amount, walletAddress } = req.body as {
    fromToken: string;
    toToken: string;
    amount: string;
    walletAddress: string;
  };

  const signer = wallet.connect(provider);
  const swapContract = new provider.ethers.Contract(
    process.env.SWAP_CONTRACT_ADDRESS!,
    // SwapABI,
    signer
  );
  try {
    const tx = await swapContract.swap(
      fromToken,
      toToken,
      provider.format.parseUnits(amount, 18)
    );
    await tx.wait();

    // Save to DB
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
export const getRecentTransactions = async (req: Request, res: Response) => {
  const { address } = req.params as { address: string };
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
