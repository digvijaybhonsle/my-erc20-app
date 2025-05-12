"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvSchema = void 0;
// server/src/config/validation.ts
const zod_1 = require("zod");
exports.EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.string().transform((val) => parseInt(val, 10)).default("4000"),
    // Ethereum RPC & wallet
    ALCHEMY_URL: zod_1.z.string().url(),
    PRIVATE_KEY: zod_1.z.string().length(64),
    // MongoDB
    DB_URI: zod_1.z.string().min(1),
    // (Optional) Rate limiting
    RATE_LIMIT_WINDOW_MS: zod_1.z
        .string()
        .transform((v) => parseInt(v, 10))
        .default("60000"),
    RATE_LIMIT_MAX: zod_1.z
        .string()
        .transform((v) => parseInt(v, 10))
        .default("100"),
});
