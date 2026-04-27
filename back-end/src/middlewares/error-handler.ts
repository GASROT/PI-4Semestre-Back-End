import type { NextFunction, Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { HttpError } from '../utils/http-error';

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({ success: false, message: 'Registro duplicado.' });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({ success: false, message: 'Registro nao encontrado.' });
      return;
    }
  }

  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(500).json({
    success: false,
    message,
  });
}
