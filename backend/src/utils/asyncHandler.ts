// src/utils/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

/**
 * Wraps async route handlers and forwards errors to Express error middleware
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
