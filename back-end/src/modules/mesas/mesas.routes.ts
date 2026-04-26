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
mesasRouter.post('/:id/abrir', validateParams(mesaParamsDto), asyncHandler(mesasController.abrir));
mesasRouter.post('/:id/fechar', validateParams(mesaParamsDto), asyncHandler(mesasController.fechar));
