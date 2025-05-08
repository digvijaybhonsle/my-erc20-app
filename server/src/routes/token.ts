// server/src/routes/token.ts
import { Router } from "express";
import { validateBody } from "../middleware/validateRequest";
import { TransferSchema } from "../utils/validators";
import * as tokenCtrl from "../controllers/tokenController";

const router = Router();

router.post(
  "/send-token",
  validateBody(TransferSchema),
  tokenCtrl.sendToken
);

router.post(
  "/send-eth",
  validateBody(TransferSchema),
  tokenCtrl.sendEth
);

export default router;
