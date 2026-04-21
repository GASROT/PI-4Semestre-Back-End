import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { produtosController } from './produtos.controller';

export const produtosRouter = Router();

produtosRouter.post('/', asyncHandler(produtosController.create));
produtosRouter.get('/', asyncHandler(produtosController.list));
produtosRouter.get('/:id', asyncHandler(produtosController.getById));
produtosRouter.patch('/:id', asyncHandler(produtosController.update));
produtosRouter.delete('/:id', asyncHandler(produtosController.deactivate));
