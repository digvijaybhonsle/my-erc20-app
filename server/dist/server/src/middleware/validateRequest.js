"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateBody = void 0;
exports.validateRequest = validateRequest;
exports.validateQuery = validateQuery;
const errors_1 = require("../utils/errors");
function validateRequest(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            throw new errors_1.HttpError(400, `Invalid request body: ${JSON.stringify(result.error.format())}`);
        }
        req.body = result.data;
        next();
    };
}
// ✅ Alias for better naming in route files
exports.validateBody = validateRequest;
function validateQuery(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            throw new errors_1.HttpError(400, `Invalid query parameters: ${JSON.stringify(result.error.format())}`);
        }
        req.query = result.data;
        next();
    };
}
const validateParams = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            res.status(400).json({ error: result.error.format() });
            return;
        }
        next();
    };
};
exports.validateParams = validateParams;
