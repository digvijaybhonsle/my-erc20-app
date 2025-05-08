import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/errors';
import { z } from 'zod';

export function validateRequest(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            throw new HttpError(400, `Invalid request body: ${JSON.stringify(result.error.format())}`);
        }
        req.body = result.data;
        next();
    };
}

// ✅ Alias for better naming in route files
export const validateBody = validateRequest;

export function validateQuery(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            throw new HttpError(400, `Invalid query parameters: ${JSON.stringify(result.error.format())}`);
        }
        req.query = result.data;
        next();
    };
}

export function validateParams(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.params);
        if (!result.success) {
            return res.status(400).json({
                message: "Invalid URL parameters",
                errors: result.error.format(),
            });
        }
        req.params = result.data;
        next();
    };
}
