"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wallet = exports.provider = void 0;
// src/web3Provider.ts
const ethers_1 = require("ethers");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.provider = new ethers_1.ethers.JsonRpcProvider(process.env.RPC_URL);
exports.wallet = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY, exports.provider);
