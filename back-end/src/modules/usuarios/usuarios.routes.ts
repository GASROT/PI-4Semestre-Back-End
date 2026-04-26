import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { usuariosController } from './usuarios.controller';
import { validateBody, validateParams } from '../../common/pipes/validation.pipe';
import { createUsuarioDto, updateUsuarioDto, usuarioParamsDto } from './usuarios.dto';

export const usuariosRouter = Router();

usuariosRouter.post('/', validateBody(createUsuarioDto), asyncHandler(usuariosController.create));
usuariosRouter.get('/', asyncHandler(usuariosController.list));
usuariosRouter.get('/:id', validateParams(usuarioParamsDto), asyncHandler(usuariosController.getById));
usuariosRouter.patch(
  '/:id',
  validateParams(usuarioParamsDto),
  validateBody(updateUsuarioDto),
  asyncHandler(usuariosController.update),
);
usuariosRouter.delete('/:id', validateParams(usuarioParamsDto), asyncHandler(usuariosController.deactivate));
