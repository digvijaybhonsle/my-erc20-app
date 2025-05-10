import { Router } from "express";
import { validateParams } from "../middleware/validateRequest";
import { BalanceParamsSchema } from "../utils/validators";
import * as walletCtrl from "../controllers/walletController";
import { asyncHandler } from "../utils/errorHandler";

const router = Router();

router.get("/nonce", asyncHandler(walletCtrl.getNonce));
router.post("/login", asyncHandler(walletCtrl.login));

router.get(
  "/balances/:address",
  validateParams(BalanceParamsSchema),
  asyncHandler(walletCtrl.getBalances)
);

export default router;
