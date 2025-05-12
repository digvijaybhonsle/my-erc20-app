"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentTransactions = exports.swapTokens = exports.sendETH = void 0;
// import { wallet, provider } from "../web3Provider";
const trade_1 = __importDefault(require("../db/models/trade"));
const ethers_1 = require("ethers");
// Initialize provider and wallet (configure via environment variables)
const provider = new ethers_1.ethers.JsonRpcProvider(process.env.ALCHEMY_URL || "YOUR_PROVIDER_URL");
const wallet = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY || "YOUR_PRIVATE_KEY", provider);
const sendETH = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { to, amount, walletAddress } = req.body;
    try {
        // Validate inputs
        if (!ethers_1.ethers.isAddress(to) || !ethers_1.ethers.isAddress(walletAddress)) {
            res.status(400).json({ error: "Invalid Ethereum address" });
            return;
        }
        let parsedAmount;
        try {
            parsedAmount = ethers_1.ethers.parseEther(amount);
        }
        catch (_a) {
            res.status(400).json({ error: "Invalid amount format" });
            return;
        }
        if (parsedAmount <= 0) {
            res.status(400).json({ error: "Amount must be greater than 0" });
            return;
        }
        // Send ETH transaction
        const signer = wallet.connect(provider);
        const tx = yield signer.sendTransaction({
            to,
            value: parsedAmount,
        });
        yield tx.wait();
        // Persist trade to database
        yield trade_1.default.create({
            walletAddress,
            type: "Send",
            details: `Sent ${amount} ETH to ${to}`,
            amount,
            tokenSymbol: "ETH",
            txHash: tx.hash,
        });
        res.json({ success: true, txHash: tx.hash });
    }
    catch (err) {
        console.error("Error in sendETH:", err);
        if (err.code === "INSUFFICIENT_FUNDS") {
            res.status(400).json({ error: "Insufficient funds for transaction" });
            return;
        }
        if (err.code === "INVALID_ARGUMENT") {
            res.status(400).json({ error: "Invalid transaction parameters" });
            return;
        }
        res.status(500).json({ error: err.message || "Internal server error" });
    }
});
exports.sendETH = sendETH;
// Swap contract configuration
const SWAP_CONTRACT_ADDRESS = process.env.SWAP_CONTRACT_ADDRESS;
const SWAP_CONTRACT_ABI = [
    "function swap(address fromToken, address toToken, uint256 amount) external",
];
// ERC20 ABI for approval
const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
];
// Initialize swap contract
const swapContract = new ethers_1.ethers.Contract(SWAP_CONTRACT_ADDRESS, SWAP_CONTRACT_ABI, wallet);
const swapTokens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fromToken, toToken, amount, walletAddress } = req.body;
    try {
        // Validate inputs
        if (!ethers_1.ethers.isAddress(fromToken) || !ethers_1.ethers.isAddress(toToken) || !ethers_1.ethers.isAddress(walletAddress)) {
            res.status(400).json({ error: "Invalid Ethereum address" });
            return;
        }
        let parsedAmount;
        try {
            parsedAmount = ethers_1.ethers.parseEther(amount); // Assumes amount is in ETH-like units; adjust for token decimals if needed
        }
        catch (_a) {
            res.status(400).json({ error: "Invalid amount format" });
            return;
        }
        if (parsedAmount <= 0) {
            res.status(400).json({ error: "Amount must be greater than 0" });
            return;
        }
        // Approve Swap contract to spend fromToken
        const fromTokenContract = new ethers_1.ethers.Contract(fromToken, ERC20_ABI, wallet);
        const signer = wallet.connect(provider);
        const allowance = yield fromTokenContract.allowance(wallet.address, SWAP_CONTRACT_ADDRESS);
        if (allowance < parsedAmount) {
            const approveTx = yield fromTokenContract.approve(SWAP_CONTRACT_ADDRESS, parsedAmount, {
                gasLimit: 100000,
            });
            yield approveTx.wait();
        }
        // Execute swap transaction
        const tx = yield swapContract.swap(fromToken, toToken, parsedAmount, {
            gasLimit: 200000,
        });
        const receipt = yield tx.wait();
        // Persist trade to database
        yield trade_1.default.create({
            walletAddress,
            type: "Swap",
            details: `Swapped ${amount} from ${fromToken} to ${toToken}`,
            amount,
            tokenSymbol: "Unknown", // Replace with actual token symbol if available
            txHash: tx.hash,
        });
        res.json({ success: true, txHash: tx.hash });
    }
    catch (err) {
        console.error("Error in swapTokens:", err);
        if (err.message.includes("swapContract.swap is not a function")) {
            res.status(500).json({ error: "Swap function not found in contract" });
            return;
        }
        if (err.code === "INSUFFICIENT_FUNDS") {
            res.status(400).json({ error: "Insufficient funds for transaction" });
            return;
        }
        if (err.code === "INVALID_ARGUMENT") {
            res.status(400).json({ error: "Invalid transaction parameters" });
            return;
        }
        res.status(500).json({ error: err.message || "Internal server error" });
    }
});
exports.swapTokens = swapTokens;
// 3. GET RECENT TRANSACTIONS
const getRecentTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const address = req.params.address;
    try {
        const trades = yield trade_1.default.find({ walletAddress: address })
            .sort({ timestamp: -1 })
            .limit(20)
            .lean();
        res.json(trades);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getRecentTransactions = getRecentTransactions;
