"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, _req, res, _next) => {
    var _a;
    // Determine HTTP status
    const status = (_a = err.status) !== null && _a !== void 0 ? _a : 500;
    res.status(status).json({
        error: {
            message: err.message || "Internal Server Error",
        },
    });
};
exports.errorHandler = errorHandler;
