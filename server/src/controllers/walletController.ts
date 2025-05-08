// server/src/controllers/walletController.ts
import { Request, Response } from "express";
import { ethereumService } from "../services/ethereumService";

export async function getBalances(req: Request, res: Response) {
  const { address } = req.params;
  const eth = await ethereumService.getEthBalance(address);
  const token = await ethereumService.getTokenBalance(address);
  res.json({ eth, token });
}

export async function sendToken(req: Request, res: Response) {
  const { to, amount } = req.body;
  const txHash = await ethereumService.transferTokens(to, amount);
  res.json({ txHash });
}
export function getNonce(arg0: string, getNonce: any) {
    throw new Error("Function not implemented.");
}

export function login(arg0: string, login: any) {
    throw new Error("Function not implemented.");
}
  

