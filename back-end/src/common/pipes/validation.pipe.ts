import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { ZodTypeAny } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { badRequest } from '../../utils/http-error';

type RequestSegment = 'body' | 'params' | 'query';

function validateSegment(segment: RequestSegment, schema: ZodTypeAny): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req[segment]);

    if (!parsed.success) {
      return next(badRequest(fromZodError(parsed.error).message));
    }

    if (segment === 'body') {
      req.body = parsed.data as Request['body'];
    }

    if (segment === 'params') {
      req.params = parsed.data as Request['params'];
    }

    if (segment === 'query') {
      req.query = parsed.data as Request['query'];
    }

    return next();
  };
}

export const validateBody = (schema: ZodTypeAny) => validateSegment('body', schema);
export const validateParams = (schema: ZodTypeAny) => validateSegment('params', schema);
export const validateQuery = (schema: ZodTypeAny) => validateSegment('query', schema);
