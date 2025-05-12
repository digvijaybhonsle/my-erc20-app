"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
// server/src/utils/logger.ts
exports.log = {
    warn: (message) => console.warn(message),
    error: (message, err) => {
        console.error(message, err);
    },
};
