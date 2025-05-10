import { Request, Response } from "express";
import axios from "axios";
import { provider, wallet } from "../web3Provider";
import SwapABI from "../abi/Swap.json";
import TradeModel, { ITrade } from "../db/models/trade";
import { ethers } from "ethers";

// 1. GET BALANCES
export const getBalances = async (req: Request, res: Response) => {
  const { address } = req.params as { address: string };
  try {
    const ethBalance = await provider.getBalance(address);
    const usdcContract = new ethers.Contract(
      process.env.USDC_ADDRESS!,
      ["function balanceOf(address) view returns (uint256)"],
      provider
    );
    const usdcBal = await usdcContract.balanceOf(address);
    res.json({
      eth: ethers.formatEther(ethBalance),
      usdc: ethers.formatUnits(usdcBal, 6),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 2. GET LIVE PRICES
export const getLivePrices = async (_req: Request, res: Response) => {
  try {
    const response = await axios.get("https://api.delta.exchange/v2/tickers");
    const tickers = response.data.result;
    const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
    const prices: Record<string, string> = {};
    symbols.forEach((sym) => {
      const entry = tickers.find((t: any) => t.symbol === sym);
      prices[sym.replace("USDT", "")] = entry?.last_price;
    });
    res.json(prices);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 3. GET PRICE HISTORY
export const getPriceHistory = async (req: Request, res: Response) => {
  const symbol = (req.query.symbol as string) || "ETHUSDT";
  const days = parseInt((req.query.range as string) || "7", 10);
  try {
    // Here we return dummy last_price repeated; integrate a historical API for real data
    const response = await axios.get("https://api.delta.exchange/v2/tickers");
    const entry = response.data.result.find((t: any) => t.symbol === symbol);
    const labels = Array.from({ length: days }, (_, i) => `Day ${i + 1}`);
    const prices = labels.map(() =>
      entry ? Number(entry.last_price) : 0
    );
    res.json({ labels, prices });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 4. QUICK SWAP (same as trade)
export const swapTokens = async (req: Request, res: Response) => {
  const { fromToken, toToken, amount, walletAddress } = req.body as {
    fromToken: string;
    toToken: string;
    amount: string;
    walletAddress: string;
  };
  try {
    const signer = wallet.connect(provider);
    const swapContract = new ethers.Contract(
      process.env.SWAP_CONTRACT_ADDRESS!,
      SwapABI,
      signer
    );
    const tx = await swapContract.swap(
      fromToken,
      toToken,
      ethers.parseUnits(amount, 18)
    );
    await tx.wait();

    // record in DB
    const trade: Partial<ITrade> = {
      walletAddress,
      type: "Swap",
      details: `Swapped ${amount} ${fromToken}→${toToken}`,
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
