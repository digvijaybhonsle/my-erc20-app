"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = rateLimiter;
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const ipMap = new Map();
function rateLimiter(req, res, next) {
    const ip = req.ip || "unknown";
    const now = Date.now();
    const windowMs = config_1.config.RATE_LIMIT_WINDOW_MS;
    const max = config_1.config.RATE_LIMIT_MAX;
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
        throw new errors_1.HttpError(429, "Too many requests - try again later");
    }
    next();
}
