// server/src/middleware/rateLimiter.ts
import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { HttpError } from "../utils/errors";

const ipMap = new Map<string, { count: number; firstRequest: number }>();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || "unknown";
  const now = Date.now();
  const windowMs = config.RATE_LIMIT_WINDOW_MS;
  const max = config.RATE_LIMIT_MAX;

  let entry = ipMap.get(ip);
  if (!entry) {
    entry = { count: 1, firstRequest: now };
    ipMap.set(ip, entry);
    return next();
  }

  if (now - entry.firstRequest > windowMs) {
    // Reset window
    entry.count = 1;
    entry.firstRequest = now;
    return next();
  }

  entry.count++;
  if (entry.count > max) {
    throw new HttpError(429, "Too many requests - try again later");
  }
  next();
}
