import type { NextFunction, Request, Response } from 'express';
import type { User } from '@supabase/supabase-js';
import { supabaseAuthClient } from '../../config/supabase';
import { badRequest, unauthorized } from '../../utils/http-error';

function extractBearerToken(req: Request): string {
  const value = req.headers.authorization;

  if (!value?.startsWith('Bearer ')) {
    throw unauthorized('Token Bearer nao informado.');
  }

  const token = value.slice(7).trim();

  if (!token) {
    throw unauthorized('Token Bearer nao informado.');
  }

  return token;
}

export async function authGuard(req: Request, _res: Response, next: NextFunction) {
  try {
    if (!supabaseAuthClient) {
      throw badRequest('Supabase nao configurado para autenticacao.');
    }

    const token = extractBearerToken(req);
    const { data, error } = await supabaseAuthClient.auth.getUser(token);

    if (error || !data.user) {
      throw unauthorized('Token invalido.');
    }

    req.auth = {
      token,
      user: data.user as User,
    };

    return next();
  } catch (error) {
    return next(error);
  }
}
