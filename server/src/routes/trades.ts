// server/src/routes/trade.ts
import { Router } from "express";
import { asyncHandler } from "../utils/errorHandler";
import * as tradeCtrl from "../controllers/tradeController";

const router = Router();

router.post("/send", asyncHandler(tradeCtrl.sendETH));
router.post("/swap", asyncHandler(tradeCtrl.swapTokens));
router.get("/:address/transactions", asyncHandler(tradeCtrl.getRecentTransactions));

export default router;
