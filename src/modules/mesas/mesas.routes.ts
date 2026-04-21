import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { mesasController } from './mesas.controller';

export const mesasRouter = Router();

mesasRouter.post('/', asyncHandler(mesasController.create));
mesasRouter.get('/', asyncHandler(mesasController.list));
mesasRouter.get('/:id', asyncHandler(mesasController.getById));
mesasRouter.patch('/:id', asyncHandler(mesasController.update));
mesasRouter.post('/:id/abrir', asyncHandler(mesasController.abrir));
mesasRouter.post('/:id/fechar', asyncHandler(mesasController.fechar));
