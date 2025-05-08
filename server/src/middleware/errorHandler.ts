// server/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/errors";
import { log } from "../utils/logger";

export function errorHandler(
  err: Error | HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof HttpError) {
    log.warn(`HTTP ${err.status}: ${err.message}`);
    return res.status(err.status).json({ error: err.message });
  }
  log.error(err.message, err);
  res.status(500).json({ error: "Internal Server Error" });
}
