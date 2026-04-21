import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { pedidosController } from './pedidos.controller';

export const pedidosRouter = Router();

pedidosRouter.post('/', asyncHandler(pedidosController.create));
pedidosRouter.get('/', asyncHandler(pedidosController.list));
pedidosRouter.get('/:id', asyncHandler(pedidosController.getById));
pedidosRouter.post('/:id/itens', asyncHandler(pedidosController.addItem));
pedidosRouter.patch('/:id/status', asyncHandler(pedidosController.updateStatus));
pedidosRouter.patch('/:id/cancelar', asyncHandler(pedidosController.cancel));
