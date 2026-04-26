import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { pedidosController } from './pedidos.controller';
import { validateBody, validateParams } from '../../common/pipes/validation.pipe';
import {
  addItemPedidoDto,
  createPedidoDto,
  pedidoParamsDto,
  updateStatusPedidoDto,
} from './pedidos.dto';

export const pedidosRouter = Router();

pedidosRouter.post('/', validateBody(createPedidoDto), asyncHandler(pedidosController.create));
pedidosRouter.get('/', asyncHandler(pedidosController.list));
pedidosRouter.get('/:id', validateParams(pedidoParamsDto), asyncHandler(pedidosController.getById));
pedidosRouter.post(
  '/:id/itens',
  validateParams(pedidoParamsDto),
  validateBody(addItemPedidoDto),
  asyncHandler(pedidosController.addItem),
);
pedidosRouter.patch(
  '/:id/status',
  validateParams(pedidoParamsDto),
  validateBody(updateStatusPedidoDto),
  asyncHandler(pedidosController.updateStatus),
);
pedidosRouter.patch('/:id/cancelar', validateParams(pedidoParamsDto), asyncHandler(pedidosController.cancel));
