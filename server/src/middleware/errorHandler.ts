// src/middleware/errorHandler.ts
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { HttpError } from "http-errors";

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {
  // Determine HTTP status
  const status = (err as HttpError).status ?? 500;

  res.status(status).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
};
