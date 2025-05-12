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
exports.dbService = void 0;
const User_1 = require("../db/models/User");
const Transaction_1 = require("../db/models/Transaction");
const crypto_1 = require("crypto");
class DBService {
    /** Create or update a user with a new nonce (for signature auth) */
    upsertUserNonce(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const nonce = (0, crypto_1.randomUUID)();
            const user = yield User_1.User.findOneAndUpdate({ address }, { address, nonce }, { upsert: true, new: true });
            return user.nonce;
        });
    }
    //get user by address
    getUserByAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return User_1.User.findOne({ address }).exec();
        });
    }
    /** Log an on‑chain transaction */
    logTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            return Transaction_1.Transaction.create({
                txHash: tx.txHash,
                from: tx.from,
                to: tx.to,
                amount: tx.amount,
            });
        });
    }
    /** Fetch recent transactions for an address */
    getTransactionsByAddress(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return Transaction_1.Transaction.find({
                $or: [{ from: address }, { to: address }],
            })
                .sort({ timestamp: -1 })
                .limit(50)
                .exec();
        });
    }
}
exports.dbService = new DBService();
