"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const TranscationSchema = new mongoose_1.Schema({
    txHash: { type: String, required: true, unique: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    amount: { type: String, required: true },
    timestamp: { type: Date, default: () => new Date() },
});
exports.Transaction = (0, mongoose_1.model)("Transaction", TranscationSchema);
