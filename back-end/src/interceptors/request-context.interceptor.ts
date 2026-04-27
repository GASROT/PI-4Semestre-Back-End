import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export function requestContextInterceptor(req: Request, res: Response, next: NextFunction) {
  const requestId = crypto.randomUUID();
  req.requestId = requestId;
  req.startedAt = process.hrtime.bigint();
  res.setHeader('X-Request-Id', requestId);
  next();
}
