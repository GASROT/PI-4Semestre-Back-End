import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { authController } from './auth.controller';
import { validateBody } from '../../common/pipes/validation.pipe';
import { authGuard } from '../../common/guards/auth.guard';
import { loginAuthDto } from './auth.dto';

export const authRouter = Router();

authRouter.post('/login', validateBody(loginAuthDto), asyncHandler(authController.login));
authRouter.get('/me', authGuard, asyncHandler(authController.me));
