"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.RPC_URL) {
    throw new Error("RPC_URL is not set in environment variables");
}
const provider = new ethers_1.ethers.JsonRpcProvider(process.env.RPC_URL);
exports.default = provider;
