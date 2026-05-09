import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { mesasController } from './mesas.controller';
import { validateBody, validateParams } from '../../common/pipes/validation.pipe';
import { createMesaDto, mesaParamsDto, updateMesaDto } from './mesas.dto';

export const mesasRouter = Router();

mesasRouter.post('/', validateBody(createMesaDto), asyncHandler(mesasController.create));
mesasRouter.get('/', asyncHandler(mesasController.list));
mesasRouter.get('/:id', validateParams(mesaParamsDto), asyncHandler(mesasController.getById));
mesasRouter.patch(
  '/:id',
  validateParams(mesaParamsDto),
  validateBody(updateMesaDto),
  asyncHandler(mesasController.update),
);

// ===== ROTAS ORIGINAIS =====
mesasRouter.post('/:id/abrir', validateParams(mesaParamsDto), asyncHandler(mesasController.abrir));
mesasRouter.post('/:id/fechar', validateParams(mesaParamsDto), asyncHandler(mesasController.fechar));

// ===== NOVAS ROTAS PARA QRCODE E VALIDAÇÃO =====
mesasRouter.get(
  '/:id/qrcode',
  validateParams(mesaParamsDto),
  asyncHandler(mesasController.gerarQrCode),
);
mesasRouter.post(
  '/:id/abrir-com-token',
  validateParams(mesaParamsDto),
  asyncHandler(mesasController.abrirComToken),
);
mesasRouter.post(
  '/:id/fechar-com-evento',
  validateParams(mesaParamsDto),
  asyncHandler(mesasController.fecharComEvento),
);
mesasRouter.get(
  '/:id/validar-token',
  validateParams(mesaParamsDto),
  asyncHandler(mesasController.validarToken),
);
mesasRouter.get(
  '/:id/comanda-ativa',
  validateParams(mesaParamsDto),
  asyncHandler(mesasController.obterComandaAtivaByMesa),
);
mesasRouter.get(
  '/:id/eventos',
  validateParams(mesaParamsDto),
  asyncHandler(mesasController.listarEventos),
);

// ===== ROTAS TOTEM =====
mesasRouter.post(
  '/:id/totem-checkin',
  validateParams(mesaParamsDto),
  asyncHandler(mesasController.totemCheckin),
);

// ===== ROTAS KDS (COZINHA) =====
mesasRouter.get('/kds/fila', asyncHandler(mesasController.obterFilaKds));
mesasRouter.post(
  '/:id/finalizar-kds',
  validateParams(mesaParamsDto),
  asyncHandler(mesasController.finalizarKds),
);

// ===== ROTAS CHECKOUT =====
mesasRouter.get(
  '/:id/checkout/total',
  validateParams(mesaParamsDto),
  asyncHandler(mesasController.obterTotalCheckout),
);
mesasRouter.post(
  '/:id/checkout/finalizar',
  validateParams(mesaParamsDto),
  asyncHandler(mesasController.finalizarCheckout),
);

// ===== ROTAS HISTÓRICO =====
mesasRouter.get('/historico/comandas', asyncHandler(mesasController.obterHistoricoComandas));
