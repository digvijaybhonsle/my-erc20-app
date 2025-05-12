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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalances = getBalances;
exports.sendToken = sendToken;
exports.getNonce = getNonce;
exports.login = login;
const ethereumService_1 = require("../services/ethereumService");
function getBalances(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { address } = req.params;
        const eth = yield ethereumService_1.ethereumService.getEthBalance(address);
        const token = yield ethereumService_1.ethereumService.getTokenBalance(address);
        res.json({ eth, token });
    });
}
function sendToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { to, amount } = req.body;
        const txHash = yield ethereumService_1.ethereumService.transferTokens(to, amount);
        res.json({ txHash });
    });
}
// ✅ Implement login and getNonce
function getNonce(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { address } = req.query;
        if (!address || typeof address !== "string") {
            return res.status(400).json({ error: "Address is required" });
        }
        // Replace with your own logic
        const nonce = Math.floor(Math.random() * 1000000);
        res.json({ nonce });
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { address, signature } = req.body;
        if (!address || !signature) {
            return res.status(400).json({ error: "Missing address or signature" });
        }
        // Replace with your login verification logic
        res.json({ success: true, address });
    });
}
