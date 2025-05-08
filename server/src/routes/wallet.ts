import { Router } from "express";
import { validateParams } from "../middleware/validateRequest";
import { BalanceParamsSchema } from "../utils/validators";
import * as walletCtrl from "../controllers/walletController";

const router = Router();   

router.get("/nonce", walletCtrl.getNonce);
router.post("/login", walletCtrl.login);

// Define the route to get balances
router.get("/balances/:address", validateParams(BalanceParamsSchema), walletCtrl.getBalances);

export default router;
