"use strict";
// server/src/config/default.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = void 0;
exports.defaults = {
    NODE_ENV: "development",
    PORT: 4000,
    RATE_LIMIT_WINDOW_MS: 60000, // 1 minute
    RATE_LIMIT_MAX: 100, // max requests per window
};
