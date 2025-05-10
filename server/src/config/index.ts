import * as dotenv from 'dotenv';
import { z } from 'zod';
import { EnvSchema } from './validation';
import { defaults } from './default';

dotenv.config();

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

export const config = {
    NODE_ENV: parsed.data.NODE_ENV,
    PORT: parsed.data.PORT,

    ALCHEMY_URL: parsed.data.ALCHEMY_URL,
    PRIVATE_KEY: parsed.data.PRIVATE_KEY,

    DB_URI: parsed.data.DB_URI,

    RATE_LIMIT_WINDOW_MS: parsed.data.RATE_LIMIT_WINDOW_MS,
    RATE_LIMIT_MAX: parsed.data.RATE_LIMIT_MAX,
};
