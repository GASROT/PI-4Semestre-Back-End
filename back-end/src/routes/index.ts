import { Router } from 'express';
import { healthRouter } from './health.routes';
import { usuariosRouter } from '../modules/usuarios/usuarios.routes';
import { mesasRouter } from '../modules/mesas/mesas.routes';
import { pedidosRouter } from '../modules/pedidos/pedidos.routes';
import { produtosRouter } from '../modules/produtos/produtos.routes';
import { fornecedoresRouter } from '../modules/fornecedores/fornecedores.routes';
import { authRouter } from '../modules/auth/auth.routes';
import { authGuard } from '../common/guards/auth.guard';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/usuarios', authGuard, usuariosRouter);
apiRouter.use('/mesas', authGuard, mesasRouter);
apiRouter.use('/pedidos', authGuard, pedidosRouter);
apiRouter.use('/produtos', authGuard, produtosRouter);
apiRouter.use('/fornecedores', authGuard, fornecedoresRouter);
