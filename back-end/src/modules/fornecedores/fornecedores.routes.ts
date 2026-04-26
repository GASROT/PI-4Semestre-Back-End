import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { fornecedoresController } from './fornecedores.controller';
import { validateBody, validateParams } from '../../common/pipes/validation.pipe';
import { createFornecedorDto, fornecedorParamsDto, updateFornecedorDto } from './fornecedores.dto';

export const fornecedoresRouter = Router();

fornecedoresRouter.post('/', validateBody(createFornecedorDto), asyncHandler(fornecedoresController.create));
fornecedoresRouter.get('/', asyncHandler(fornecedoresController.list));
fornecedoresRouter.get('/:id', validateParams(fornecedorParamsDto), asyncHandler(fornecedoresController.getById));
fornecedoresRouter.patch(
  '/:id',
  validateParams(fornecedorParamsDto),
  validateBody(updateFornecedorDto),
  asyncHandler(fornecedoresController.update),
);
fornecedoresRouter.delete('/:id', validateParams(fornecedorParamsDto), asyncHandler(fornecedoresController.deactivate));
