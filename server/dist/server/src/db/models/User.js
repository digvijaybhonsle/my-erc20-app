"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    address: { type: String, required: true, unique: true },
    nonce: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
});
exports.User = (0, mongoose_1.model)("User", UserSchema);
