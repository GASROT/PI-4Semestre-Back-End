import type { NextFunction, Request, Response } from 'express';

export function responseTimingInterceptor(req: Request, res: Response, next: NextFunction) {
  const startedAt = req.startedAt ?? process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const requestId = req.requestId ? ` ${req.requestId}` : '';
    console.log(
      `[${req.method}] ${req.originalUrl} -> ${res.statusCode} in ${durationMs.toFixed(2)}ms${requestId}`,
    );
  });

  next();
}
