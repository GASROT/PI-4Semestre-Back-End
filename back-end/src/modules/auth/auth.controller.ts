import type { Request, Response } from 'express';
import { unauthorized } from '../../utils/http-error';
import { authService } from './auth.service';
import type { LoginAuthDto } from './auth.dto';

export const authController = {
  async login(req: Request, res: Response) {
    const { email, senha } = req.body as LoginAuthDto;

    const session = await authService.login(email, senha);
    res.status(200).json({ success: true, data: session });
  },

  async me(req: Request, res: Response) {
    const token = req.auth?.token;
    if (!token) {
      throw unauthorized('Token Bearer nao informado.');
    }
    const user = await authService.me(token);
    res.status(200).json({ success: true, data: user });
  },
};
