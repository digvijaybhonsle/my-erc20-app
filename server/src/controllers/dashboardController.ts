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


const DELTA_API_KEY = process.env.DELTA_API_KEY!;
const DELTA_HEADERS = {
  'api-key': DELTA_API_KEY,
};

// === 3. GET LIVE PRICES FROM DELTA ===
export const getLivePrices: RequestHandler = async (_req, res) => {
  try {
    const response = await axios.get('https://api.delta.exchange/v2/tickers', {
      headers: DELTA_HEADERS,
      timeout: 5000,
    });

    // Log the full response to inspect the structure
    console.log("Delta API Response:", response.data);

    if (!response.data.success || !Array.isArray(response.data.result)) {
      throw new Error('Unexpected response structure');
    }

    const tickers = response.data.result as any[];

    if (tickers.length === 0) {
      throw new Error('No tickers returned from Delta API');
    }

    // Log all available symbols for debugging
    console.log("Available symbols:", tickers.map(t => t.symbol));

    const getPrice = (symbol: string): string | null => {
      const ticker = tickers.find(
        t =>
          t.contract_type === 'perpetual_futures' &&
          t.symbol.toLowerCase() === symbol.toLowerCase()
      );
      console.log(`Found ticker for ${symbol}:`, ticker);
      // Use mark_price instead of last_price
      return ticker?.mark_price?.toString() || null;
    };

    // Return the prices for the tickers
    res.json({
      BTC: getPrice('BTCUSDT'),
      ETH: getPrice('ETHUSDT'),
      SOL: getPrice('SOLUSDT'),
    });
  } catch (err: any) {
    console.error('Error fetching live prices:', err.message || err);
    console.error('Error details:', err.response?.data || err);
    res.status(500).json({ error: 'Failed to fetch live prices' });
  }
};

// === 4. GET PRICE HISTORY FROM DELTA ===
export const getPriceHistory: RequestHandler = async (req, res) => {
  const symbolMap: Record<string, string> = {
    eth: 'ETHUSDT',
    btc: 'BTCUSDT',
    sol: 'SOLUSDT',
    ethereum: 'ETHUSDT',
    bitcoin: 'BTCUSDT',
    solana: 'SOLUSDT',
  };

  const raw = (req.query.symbol as string || 'eth').toLowerCase();
  const symbol = symbolMap[raw] || 'ETHUSDT';
  const days = parseInt((req.query.range as string) || '7', 10);
  if (isNaN(days) || days <= 0) {
    res.status(400).json({ error: "'range' must be a positive integer" });
    return; // early return
  }

  // Compute Unix timestamps (in seconds)
  const end = Math.floor(Date.now() / 1000);
  const start = end - days * 24 * 60 * 60;

  try {
    const response = await axios.get(
      'https://api.delta.exchange/v2/history/candles',
      {
        headers: DELTA_HEADERS,
        timeout: 5000,
        params: { symbol, resolution: '1d', start, end },
      }
    );

    if (!response.data.success || !Array.isArray(response.data.result)) {
      throw new Error('Unexpected response structure');
    }
    const candles = response.data.result as Array<{
      time: number;
      close: string;
    }>;

    const labels = candles.map(c =>
      new Date(c.time * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    );
    const prices = candles.map(c =>
      parseFloat(parseFloat(c.close).toFixed(2))
    );

    res.json({ labels, prices });
  } catch (err: any) {
    console.error('Error fetching price history:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch price history' });
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
