"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceParamsSchema = exports.TransferSchema = void 0;
// server/src/utils/validators.ts
const zod_1 = require("zod");
exports.TransferSchema = zod_1.z.object({
    to: zod_1.z.string().length(42), // Ethereum address
    amount: zod_1.z.string().regex(/^\d+(\.\d+)?$/), // Decimal number as string
});
exports.BalanceParamsSchema = zod_1.z.object({
    address: zod_1.z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});
