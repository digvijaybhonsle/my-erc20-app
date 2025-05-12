"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/routes/index.ts
const express_1 = require("express");
const wallet_1 = __importDefault(require("./wallet"));
const token_1 = __importDefault(require("./token"));
const router = (0, express_1.Router)();
router.use("/wallet", wallet_1.default);
router.use("/token", token_1.default);
exports.default = router;
