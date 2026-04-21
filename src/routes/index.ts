import { Router } from 'express';
import { healthRouter } from './health.routes';
import { usuariosRouter } from '../modules/usuarios/usuarios.routes';
import { mesasRouter } from '../modules/mesas/mesas.routes';
import { pedidosRouter } from '../modules/pedidos/pedidos.routes';
import { produtosRouter } from '../modules/produtos/produtos.routes';
import { fornecedoresRouter } from '../modules/fornecedores/fornecedores.routes';
import { authRouter } from '../modules/auth/auth.routes';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/usuarios', usuariosRouter);
apiRouter.use('/mesas', mesasRouter);
apiRouter.use('/pedidos', pedidosRouter);
apiRouter.use('/produtos', produtosRouter);
apiRouter.use('/fornecedores', fornecedoresRouter);
