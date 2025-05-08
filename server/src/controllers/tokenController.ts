// server/src/controllers/tokenController.ts
import { Request, Response, NextFunction } from "express";
import { ethereumService } from "../services/ethereumService";
import { dbService } from "../services/dbServices";

export async function sendToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { to, amount } = req.body;
    const txHash = await ethereumService.transferTokens(to, amount);
    await dbService.logTransaction({ txHash, from: ethereumService.serverAddress, to, amount });
    res.json({ txHash });
  } catch (err) {
    next(err);
  }
}

export async function sendEth(req: Request, res: Response, next: NextFunction) {
  try {
    const { to, amount } = req.body;
    const txHash = await ethereumService.sendEth(to, amount);
    await dbService.logTransaction({ txHash, from: ethereumService.serverAddress, to, amount });
    res.json({ txHash });
  } catch (err) {
    next(err);
  }
}
