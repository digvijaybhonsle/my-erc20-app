import { Router, Request, Response } from "express";
import TradeModel from "../db/models/trade"; // Mongoose model
// import SwapABI from "../abi/Swap.json";
import { ethers } from "ethers";
// import asyncHandler from "../utils/asyncHandler";

interface SwapBody {
  fromToken: string;
  toToken: string;
  amount: string;
  walletAddress: string;
}

const router = Router();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

// 1. Send ETH
// router.post("/send", asyncHandler(tradeCtrl.sendETH));

// 2. Swap Tokens
router.post("/", async (req: Request<{}, {}, SwapBody>, res: Response) => {
  const { fromToken, toToken, amount, walletAddress } = req.body;
  try {
    const swapContract = new ethers.Contract(
      process.env.SWAP_CONTRACT_ADDRESS!,
      [], // Replace with SwapABI when available
      wallet
    );

    const tx = await swapContract.swap(
      fromToken,
      toToken,
      ethers.parseUnits(amount, 18), // adjust decimals as needed
      { from: walletAddress }
    );
    await tx.wait();

    res.json({ txHash: tx.hash, status: "success" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get(
  "/:address/trades",
  async (req: Request<{ address: string }>, res: Response) => {
    const { address } = req.params;
    try {
      const trades = await TradeModel.find({ walletAddress: address })
        .sort({ timestamp: -1 })
        .lean();
      res.json(trades);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
