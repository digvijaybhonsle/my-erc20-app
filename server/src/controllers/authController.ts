// server/src/controllers/authController.ts
import { Request, Response } from "express";
import { dbService } from "../services/dbServices";

export async function getNonce(req: Request, res: Response) {
  const { address } = req.query;
  const nonce = await dbService.upsertUserNonce(address as string);
  res.json({ nonce });
}
