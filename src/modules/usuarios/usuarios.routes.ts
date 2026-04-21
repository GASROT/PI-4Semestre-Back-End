import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { usuariosController } from './usuarios.controller';

export const usuariosRouter = Router();

usuariosRouter.post('/', asyncHandler(usuariosController.create));
usuariosRouter.get('/', asyncHandler(usuariosController.list));
usuariosRouter.get('/:id', asyncHandler(usuariosController.getById));
usuariosRouter.patch('/:id', asyncHandler(usuariosController.update));
usuariosRouter.delete('/:id', asyncHandler(usuariosController.deactivate));
