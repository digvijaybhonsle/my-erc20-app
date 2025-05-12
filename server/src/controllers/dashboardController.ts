import { RequestHandler } from "express";
import axios from "axios";
import { ethers } from "ethers";
import provider from "../utils/web3Provider";
import { wallet } from "../web3Provider";
import LockArtifact from "../../abi/Lock.json";
import TradeModel, { ITrade } from "../db/models/trade";

const erc20Abi = ["function balanceOf(address) view returns (uint256)"];

// 1. GET BALANCES
export const getBalances: RequestHandler = async (req, res) => {
  const address = req.params.address as string;
  try {
    const ethBalance = await provider.getBalance(address);
    res.json({
      eth: ethers.formatEther(ethBalance),
    });
  } catch (err: any) {
    console.error("Error fetching ETH balance:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
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

// Common headers for all CoinGecko requests
const COINGECKO_HEADERS = {
  'User-Agent': 'my-erc20-app/1.0 (digvijaybhonsle007@gmail.com)',
  'Accept': 'application/json',
};

// === 3. GET LIVE PRICES ===
export const getLivePrices: RequestHandler = async (_req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      headers: COINGECKO_HEADERS,
      timeout: 5000,
      params: {
        ids: 'ethereum,bitcoin,solana',
        vs_currencies: 'usd',
      },
    });

    const data = response.data;

    const prices: Record<string, string | null> = {
      BTC: data.bitcoin?.usd?.toString() || null,
      ETH: data.ethereum?.usd?.toString() || null,
      SOL: data.solana?.usd?.toString() || null,
    };

    res.json(prices);
  } catch (err: any) {
    console.error("Error fetching prices from CoinGecko:", err);
    res.status(500).json({ error: "Failed to fetch live prices" });
  }
};


// === 4. GET PRICE HISTORY ===
export const getPriceHistory: RequestHandler = async (req, res) => {
  const symbolMap: Record<string, string> = {
    eth: "ethereum",
    btc: "bitcoin",
    sol: "solana",
    ethereum: "ethereum",
    bitcoin: "bitcoin",
    solana: "solana",
  };

  const rawSymbol = (req.query.symbol as string || "eth").toLowerCase();
  const symbol = symbolMap[rawSymbol] || rawSymbol;
  const days = parseInt((req.query.range as string) || "7", 10);

  if (isNaN(days) || days <= 0) {
    res.status(400).json({ error: "Invalid 'range' parameter. It should be a positive integer." });
    return;
  }

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart`,
      {
        headers: COINGECKO_HEADERS,
        timeout: 5000,
        params: {
          vs_currency: 'usd',
          days: days.toString(),
        },
      }
    );

    const pricesData = response.data.prices as [number, number][];

    const labels = pricesData.map(([timestamp]) =>
      new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    );

    const prices = pricesData.map(([, price]) =>
      parseFloat(price.toFixed(2))
    );

    res.json({ labels, prices });
  } catch (err: any) {
  console.error("Error fetching prices history from CoinGecko:", err);
  res.status(500).json({ error: "Failed to fetch price history" });
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
      (LockArtifact as any).abi,
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
