// server/src/config/default.ts

export const defaults = {
    NODE_ENV: "development" as const,
    PORT: 4000,
    RATE_LIMIT_WINDOW_MS: 60_000, // 1 minute
    RATE_LIMIT_MAX: 100, // max requests per window
  };
  