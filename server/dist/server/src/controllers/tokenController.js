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
exports.sendToken = sendToken;
exports.sendEth = sendEth;
const ethereumService_1 = require("../services/ethereumService");
const dbServices_1 = require("../services/dbServices");
function sendToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { to, amount } = req.body;
            const txHash = yield ethereumService_1.ethereumService.transferTokens(to, amount);
            yield dbServices_1.dbService.logTransaction({ txHash, from: ethereumService_1.ethereumService.serverAddress, to, amount });
            res.json({ txHash });
        }
        catch (err) {
            next(err);
        }
    });
}
function sendEth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { to, amount } = req.body;
            const txHash = yield ethereumService_1.ethereumService.sendEth(to, amount);
            yield dbServices_1.dbService.logTransaction({ txHash, from: ethereumService_1.ethereumService.serverAddress, to, amount });
            res.json({ txHash });
        }
        catch (err) {
            next(err);
        }
    });
}
