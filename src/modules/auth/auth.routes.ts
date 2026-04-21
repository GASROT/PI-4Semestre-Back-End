import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { authController } from './auth.controller';

export const authRouter = Router();

authRouter.post('/login', asyncHandler(authController.login));
authRouter.get('/me', asyncHandler(authController.me));
