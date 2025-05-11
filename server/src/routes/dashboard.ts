// server/src/routes/dashboard.ts
import { Router } from "express";
import { asyncHandler } from "../utils/errorHandler";
import * as dashCtrl from "../controllers/dashboardController";

const router = Router();

// 1. Fetch balances (ETH, USDC, DAI)
router.get(
  "/balances/:address",
  asyncHandler(dashCtrl.getBalances)
);

// 2. Estimate swap (for “More Information”)
router.post(
  "/estimate",
  asyncHandler(dashCtrl.getSwapEstimate)
);

// 3. Live market prices (BTC, ETH, SOL)
router.get(
  "/prices",
  asyncHandler(dashCtrl.getLivePrices)
);

// 4. Price history for chart
router.get(
  "/price-history",
  asyncHandler(dashCtrl.getPriceHistory)
);

// 5. Quick swap
router.post(
  "/swap",
  asyncHandler(dashCtrl.swapTokens)
);

export default router;
