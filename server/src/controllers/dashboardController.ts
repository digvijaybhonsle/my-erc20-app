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

// 3. GET LIVE PRICES
export const getLivePrices: RequestHandler = async (_req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      headers: {
        'User-Agent': 'my-erc21-app',
      },
      params: {
        ids: 'ethereum',
        vs_currencies: 'usd',
      },
    });

    const data = response.data;

    const prices = {
      BTC: data.bitcoin.usd.toString(),
      ETH: data.ethereum.usd.toString(),
      SOL: data.solana.usd.toString(),
    };

    res.json(prices);
  } catch (err: any) {
    console.error("Error fetching prices from CoinGecko:", err.message);
    res.status(500).json({ error: err.message });
  }
};



// 4. GET PRICE HISTORY

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

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart`,
      {
        headers: {
          'User-Agent': 'my-erc21-app',
        },
        params: {
          ids: 'ethereum',
          vs_currencies: 'usd',
        },
      }
    );

    const pricesData = response.data.prices as [number, number][];
    const labels = pricesData.map(([timestamp]) =>
      new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
    const prices = pricesData.map(([, price]) => parseFloat(price.toFixed(2)));

    res.json({ labels, prices });
  } catch (err: any) {
    console.error("Error fetching price history:", err.message);
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
