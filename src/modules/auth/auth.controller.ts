import type { Request, Response } from 'express';
import { badRequest } from '../../utils/http-error';
import { authService } from './auth.service';

function extractBearerToken(req: Request): string {
  const value = req.headers.authorization;
  if (!value?.startsWith('Bearer ')) {
    throw badRequest('Token Bearer nao informado.');
  }
  return value.slice(7);
}

export const authController = {
  async login(req: Request, res: Response) {
    const { email, senha } = req.body as { email?: string; senha?: string };
    if (!email || !senha) {
      throw badRequest('Campos obrigatorios: email e senha.');
    }

    const session = await authService.login(email, senha);
    res.status(200).json({ success: true, data: session });
  },

  async me(req: Request, res: Response) {
    const token = extractBearerToken(req);
    const user = await authService.me(token);
    res.status(200).json({ success: true, data: user });
  },
};
