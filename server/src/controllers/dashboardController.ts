import { RequestHandler } from "express";
import axios from "axios";
import { ethers } from "ethers";
import provider from "../utils/web3Provider";
import { wallet } from "../web3Provider";
import SwapArtifact from "../../abi/Swap.json";
import TradeModel, { ITrade } from "../db/models/trade";

const erc20Abi = ["function balanceOf(address) view returns (uint256)"];

// 1. GET BALANCES
export const getBalances: RequestHandler = async (req, res) => {
  // assert params.address exists
  const address = req.params.address as string;
  try {
    const ethBalance = await provider.getBalance(address);

    const usdcAddress = process.env.USDC_ADDRESS!;
    const daiAddress = process.env.DAI_ADDRESS!;
    const [usdcBal, daiBal] = await Promise.all([
      new ethers.Contract(usdcAddress, erc20Abi, provider).balanceOf(address),
      new ethers.Contract(daiAddress, erc20Abi, provider).balanceOf(address),
    ]);

    res.json({
      eth: ethers.formatEther(ethBalance),
      usdc: ethers.formatUnits(usdcBal, 6),
      dai: ethers.formatUnits(daiBal, 18),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 2. SWAP ESTIMATE
export const getSwapEstimate: RequestHandler = async (req, res) => {
  const { fromToken, toToken, amount } = req.body as {
    fromToken: string;
    toToken: string;
    amount: string;
  };
  try {
    const resp = await axios.get("https://api.delta.exchange/v2/tickers");
    const tickers = resp.data.result as any[];
    const from = tickers.find((t) => t.symbol === `${fromToken}USDT`);
    const to = tickers.find((t) => t.symbol === `${toToken}USDT`);
    const received = from && to
      ? ((Number(from.last_price) / Number(to.last_price)) * Number(amount)).toFixed(6)
      : "0";
    res.json({
      receivedAmount: `${received} ${toToken}`,
      gasFee: "0.00 USD",
      priceImpact: "0.0%",
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 3. GET LIVE PRICES
export const getLivePrices: RequestHandler = async (_req, res) => {
  try {
    const response = await axios.get("https://api.delta.exchange/v2/tickers");
    const tickers = response.data.result as any[];
    const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];
    const prices: Record<string, string> = {};
    symbols.forEach((sym) => {
      const entry = tickers.find((t) => t.symbol === sym);
      if (entry) prices[sym.replace("USDT", "")] = entry.last_price;
    });
    res.json(prices);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 4. GET PRICE HISTORY
export const getPriceHistory: RequestHandler = async (req, res) => {
  const symbol = (req.query.symbol as string) || "ETHUSDT";
  const days = parseInt((req.query.range as string) || "7", 10);
  try {
    const response = await axios.get("https://api.delta.exchange/v2/tickers");
    const entry = (response.data.result as any[]).find((t) => t.symbol === symbol);
    const labels = Array.from({ length: days }, (_, i) => `Day ${i + 1}`);
    const prices = labels.map(() => (entry ? Number(entry.last_price) : 0));
    res.json({ labels, prices });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// 5. QUICK SWAP
export const swapTokens: RequestHandler = async (req, res) => {
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
      (SwapArtifact as any).abi,
      signer
    );
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
