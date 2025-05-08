// server/src/routes/index.ts
import { Router } from "express";
import walletRoutes from "./wallet";
import tokenRoutes from "./token";

const router = Router();

router.use("/wallet", walletRoutes);
router.use("/token", tokenRoutes);

export default router;
