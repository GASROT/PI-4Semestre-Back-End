import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { comandasController } from './comandas.controller';
import { validateBody } from '../../common/pipes/validation.pipe';
import {
  criarComandaDto,
  adicionarProdutoComandaDto,
  finalizarComandaDto,
  cancelarComandaDto,
} from './comandas.dto';

export const comandasRouter = Router();

// Rotas de comandas
comandasRouter.post(
  '/',
  validateBody(criarComandaDto),
  asyncHandler(comandasController.criar),
);

comandasRouter.get(
  '/:id',
  asyncHandler(comandasController.obterPorId),
);

comandasRouter.get(
  '/mesa/:mesa_id/ativa',
  asyncHandler(comandasController.obterComandaAtivaByMesa),
);

comandasRouter.post(
  '/:comanda_id/produtos',
  validateBody(adicionarProdutoComandaDto),
  asyncHandler(comandasController.adicionarProduto),
);

comandasRouter.get(
  '/:comanda_id/pedidos',
  asyncHandler(comandasController.listarPedidos),
);

comandasRouter.get(
  '/pedido/:pedido_id/itens',
  asyncHandler(comandasController.listarItensPedido),
);

comandasRouter.delete(
  '/item/:item_id',
  asyncHandler(comandasController.removerItem),
);

comandasRouter.post(
  '/:comanda_id/finalizar',
  validateBody(finalizarComandaDto),
  asyncHandler(comandasController.finalizar),
);

comandasRouter.post(
  '/:comanda_id/cancelar',
  validateBody(cancelarComandaDto),
  asyncHandler(comandasController.cancelar),
);

comandasRouter.get(
  '/mesa/:mesa_id/historico',
  asyncHandler(comandasController.historicoByMesa),
);

comandasRouter.get(
  '/ativas/listar',
  asyncHandler(comandasController.obterMesasComComandasAbertas),
);
