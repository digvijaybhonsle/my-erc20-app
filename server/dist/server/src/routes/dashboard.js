"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/routes/dashboard.ts
const express_1 = require("express");
const errorHandler_1 = require("../utils/errorHandler");
const dashCtrl = __importStar(require("../controllers/dashboardController"));
const router = (0, express_1.Router)();
// 1. Fetch balances (ETH, USDC, DAI)
router.get("/balances/:address", (0, errorHandler_1.asyncHandler)(dashCtrl.getBalances));
// 2. Estimate swap (for “More Information”)
router.post("/estimate", (0, errorHandler_1.asyncHandler)(dashCtrl.getSwapEstimate));
// 3. Live market prices (BTC, ETH, SOL)
router.get("/prices", (0, errorHandler_1.asyncHandler)(dashCtrl.getLivePrices));
// 4. Price history for chart
router.get("/price-history", (0, errorHandler_1.asyncHandler)(dashCtrl.getPriceHistory));
// 5. Quick swap
router.post("/swap", (0, errorHandler_1.asyncHandler)(dashCtrl.swapTokens));
exports.default = router;
