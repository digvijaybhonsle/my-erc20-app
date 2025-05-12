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
exports.swapTokens = exports.getPriceHistory = exports.getLivePrices = exports.getSwapEstimate = exports.getBalances = void 0;
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const web3Provider_1 = __importDefault(require("../utils/web3Provider"));
const web3Provider_2 = require("../web3Provider");
const Lock_json_1 = __importDefault(require("../../abi/Lock.json"));
const trade_1 = __importDefault(require("../db/models/trade"));
const erc20Abi = ["function balanceOf(address) view returns (uint256)"];
// 1. GET BALANCES
const getBalances = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const address = req.params.address;
    try {
        const ethBalance = yield web3Provider_1.default.getBalance(address);
        res.json({
            eth: ethers_1.ethers.formatEther(ethBalance),
        });
    }
    catch (err) {
        console.error("Error fetching ETH balance:", err);
        res.status(500).json({ error: err.message || "Internal Server Error" });
    }
});
exports.getBalances = getBalances;
// 2. SWAP ESTIMATE
const getSwapEstimate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fromToken, toToken, amount } = req.body;
    try {
        const resp = yield axios_1.default.get("https://api.delta.exchange/v2/tickers");
        const tickers = resp.data.result;
        const from = tickers.find((t) => t.symbol === `${fromToken}USDT`);
        const to = tickers.find((t) => t.symbol === `${toToken}USDT`);
        const received = from && to
            ? ((Number(from.last_price) / Number(to.last_price)) * Number(amount)).toFixed(6)
            : "0";
        res.json({
            receivedAmount: `${received} ${toToken}`,
            gasFee: "0.00 USD",
            priceImpact: "0.0%",
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getSwapEstimate = getSwapEstimate;
const DELTA_API_KEY = process.env.DELTA_API_KEY;
const DELTA_HEADERS = {
    'api-key': DELTA_API_KEY,
};
// === 3. GET LIVE PRICES FROM DELTA ===
const getLivePrices = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield axios_1.default.get('https://api.delta.exchange/v2/tickers', {
            headers: DELTA_HEADERS,
            timeout: 5000,
        });
        // Log the full response to inspect the structure
        console.log("Delta API Response:", response.data);
        if (!response.data.success || !Array.isArray(response.data.result)) {
            throw new Error('Unexpected response structure');
        }
        const tickers = response.data.result;
        if (tickers.length === 0) {
            throw new Error('No tickers returned from Delta API');
        }
        // Log all available symbols for debugging
        console.log("Available symbols:", tickers.map(t => t.symbol));
        const getPrice = (symbol) => {
            var _a;
            const ticker = tickers.find(t => t.contract_type === 'perpetual_futures' &&
                t.symbol.toLowerCase() === symbol.toLowerCase());
            console.log(`Found ticker for ${symbol}:`, ticker);
            // Use mark_price instead of last_price
            return ((_a = ticker === null || ticker === void 0 ? void 0 : ticker.mark_price) === null || _a === void 0 ? void 0 : _a.toString()) || null;
        };
        // Return the prices for the tickers
        res.json({
            BTC: getPrice('BTCUSDT'),
            ETH: getPrice('ETHUSDT'),
            SOL: getPrice('SOLUSDT'),
        });
    }
    catch (err) {
        console.error('Error fetching live prices:', err.message || err);
        console.error('Error details:', ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err);
        res.status(500).json({ error: 'Failed to fetch live prices' });
    }
});
exports.getLivePrices = getLivePrices;
// === 4. GET PRICE HISTORY FROM DELTA ===
const getPriceHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const symbolMap = {
        eth: 'ETHUSDT',
        btc: 'BTCUSDT',
        sol: 'SOLUSDT',
        ethereum: 'ETHUSDT',
        bitcoin: 'BTCUSDT',
        solana: 'SOLUSDT',
    };
    const raw = (req.query.symbol || 'eth').toLowerCase();
    const symbol = symbolMap[raw] || 'ETHUSDT';
    const days = parseInt(req.query.range || '7', 10);
    if (isNaN(days) || days <= 0) {
        res.status(400).json({ error: "'range' must be a positive integer" });
        return; // early return
    }
    // Compute Unix timestamps (in seconds)
    const end = Math.floor(Date.now() / 1000);
    const start = end - days * 24 * 60 * 60;
    try {
        const response = yield axios_1.default.get('https://api.delta.exchange/v2/history/candles', {
            headers: DELTA_HEADERS,
            timeout: 5000,
            params: { symbol, resolution: '1d', start, end },
        });
        if (!response.data.success || !Array.isArray(response.data.result)) {
            throw new Error('Unexpected response structure');
        }
        const candles = response.data.result;
        const labels = candles.map(c => new Date(c.time * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        }));
        const prices = candles.map(c => parseFloat(parseFloat(c.close).toFixed(2)));
        res.json({ labels, prices });
    }
    catch (err) {
        console.error('Error fetching price history:', err.message || err);
        res.status(500).json({ error: 'Failed to fetch price history' });
    }
});
exports.getPriceHistory = getPriceHistory;
// 5. QUICK SWAP
const swapTokens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fromToken, toToken, amount, walletAddress } = req.body;
    try {
        const signer = web3Provider_2.wallet.connect(web3Provider_1.default);
        const swapContract = new ethers_1.ethers.Contract(process.env.SWAP_CONTRACT_ADDRESS, Lock_json_1.default.abi, signer);
        const tx = yield swapContract.swap(fromToken, toToken, ethers_1.ethers.parseUnits(amount, 18));
        yield tx.wait();
        const trade = {
            walletAddress,
            type: "Swap",
            details: `Swapped ${amount} ${fromToken} → ${toToken}`,
            amount,
            tokenSymbol: fromToken,
            txHash: tx.hash,
            timestamp: new Date(),
        };
        yield trade_1.default.create(trade);
        res.json({ success: true, txHash: tx.hash });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.swapTokens = swapTokens;
