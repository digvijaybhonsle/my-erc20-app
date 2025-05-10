// server/src/config/validation.ts
import { z } from "zod";

export const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().transform((val) => parseInt(val, 10)).default("4000"),

  // Ethereum RPC & wallet
  ALCHEMY_URL: z.string().url(),
  PRIVATE_KEY: z.string().length(64),

  // MongoDB
  DB_URI: z.string().min(1),

  // (Optional) Rate limiting
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .transform((v) => parseInt(v, 10))
    .default("60000"),
  RATE_LIMIT_MAX: z
    .string()
    .transform((v) => parseInt(v, 10))
    .default("100"),
});
