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

// ✅ Implement login and getNonce
export async function getNonce(req: Request, res: Response) {
  const { address } = req.query;
  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Address is required" });
  }

  // Replace with your own logic
  const nonce = Math.floor(Math.random() * 1000000);
  res.json({ nonce });
}

export async function login(req: Request, res: Response) {
  const { address, signature } = req.body;
  if (!address || !signature) {
    return res.status(400).json({ error: "Missing address or signature" });
  }

  // Replace with your login verification logic
  res.json({ success: true, address });
}
