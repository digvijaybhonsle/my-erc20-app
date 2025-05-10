// File: server/src/routes/dashboard.ts
import * as dashCtrl from "../controllers/dashboardController";
import { asyncHandler } from "../utils/errorHandler";
import { Router, Request, Response } from "express";
import axios from "axios";
import { ethers } from "ethers";
import provider from "../utils/web3Provider";

const router = Router();

interface EstimateBody {
  fromToken: string;
  toToken: string;
  amount: string;
}

// 1. Fetch balances (ETH & USDC)
router.get(
  "/balances/:address",
  async (req: Request<{ address: string }>, res: Response) => {
    const { address } = req.params;

    try {
      const ethBalance = await provider.getBalance(address);
      const usdcAddress = process.env.USDC_ADDRESS!;
      const daiAddress = process.env.DAI_ADDRESS!;

      if (!usdcAddress || !daiAddress) {
        throw new Error("Token contract addresses are not configured in .env");
      }
      // Example: ERC20 ABI + contract address for USDC/DAI
      const erc20Abi = [
        "function balanceOf(address) view returns (uint256)",
      ];
      const usdcContract = new ethers.Contract(
        process.env.USDC_ADDRESS!,
        erc20Abi,
        provider
      );
      const daiContract = new ethers.Contract(
        process.env.DAI_ADDRESS!,
        erc20Abi,
        provider
      );
      const [usdcBal, daiBal] = await Promise.all([
        usdcContract.balanceOf(address),
        daiContract.balanceOf(address),
      ]);

      res.json({
        eth: ethers.formatEther(ethBalance),
        usdc: ethers.formatUnits(usdcBal, 6),
        dai: ethers.formatUnits(daiBal, 18),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

//estimate.ts
router.post(
  "/",
  async (req: Request<{}, {}, EstimateBody>, res: Response) => {
    const { fromToken, toToken, amount } = req.body;
    try {
      // Call your swap contract’s quote function, or use public API
      const resp = await axios.get("https://api.delta.exchange/v2/tickers");
      const tickers = resp.data.result;
      // Simplest: price difference
      const from = tickers.find((t: any) => t.symbol === `${fromToken}USDT`);
      const to = tickers.find((t: any) => t.symbol === `${toToken}USDT`);
      const receivedAmount = from && to
        ? ((Number(from.last_price) / Number(to.last_price)) * Number(amount)).toFixed(2)
        : "0";
      res.json({
        receivedAmount: `${receivedAmount} ${toToken}`,
        gasFee: "0.00 USD",
        priceImpact: "0.0%",
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

// 2. Get live crypto prices (BTC, ETH, SOL)
router.get(
  "/prices",
  asyncHandler(dashCtrl.getLivePrices)
);

// 3. Get price history for chart
router.get(
  "/",
  async (req: Request<{}, {}, {}, { symbol?: string; range?: string }>, res: Response
  ) => {
    const symbol = req.query.symbol ?? "ETHUSDT";
    const range = parseInt(req.query.range ?? "7", 10);
    // NOTE: for simplicity, here we return static labels
    try {
      const resp = await axios.get("https://api.delta.exchange/v2/tickers");
      const tickers = resp.data.result;
      const entry = tickers.find((t: any) => t.symbol === symbol);
      // You’d replace this with historical data from another API
      const labels = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
      const prices = labels.map(() =>
        entry ? Number(entry.last_price) : 0
      );
      res.json({ labels, prices });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

// 4. (Optional) Quick swap from dashboard
router.post(
  "/swap",
  asyncHandler(dashCtrl.swapTokens)
);

export default router;
