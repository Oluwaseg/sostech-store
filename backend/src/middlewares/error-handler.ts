import { NextFunction, Request, Response } from 'express';
import logger from '../libs/logger';

export class ApiError extends Error {
  statusCode: number;
  code: string | null;
  errors: any;

  constructor(
    message: string,
    statusCode = 500,
    code: string | null = null,
    errors: any = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }

  logger.error(err.stack || err.message || String(err));

  const statusCode = err.statusCode || 500;
  const response = {
    status: 'error',
    statusCode,
    message: err.message || 'Internal server error',
    code: err.code || null,
    errors: err.errors || null,
  };

  return res.status(statusCode).json(response);
};
