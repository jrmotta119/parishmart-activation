import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '@parishmart/shared';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl === '/favicon.ico') {
    return res.status(204).end();
  }
  const error = new Error(`Route ${req.originalUrl} not found`) as any;
  error.statusCode = HTTP_STATUS.NOT_FOUND;
  next(error);
}; 