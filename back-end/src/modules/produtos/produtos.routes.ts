import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { produtosController } from './produtos.controller';
import { validateBody, validateParams } from '../../common/pipes/validation.pipe';
import { createProdutoDto, produtoParamsDto, updateProdutoDto } from './produtos.dto';

export const produtosRouter = Router();

produtosRouter.post('/', validateBody(createProdutoDto), asyncHandler(produtosController.create));
produtosRouter.get('/', asyncHandler(produtosController.list));
produtosRouter.get('/:id', validateParams(produtoParamsDto), asyncHandler(produtosController.getById));
produtosRouter.patch(
  '/:id',
  validateParams(produtoParamsDto),
  validateBody(updateProdutoDto),
  asyncHandler(produtosController.update),
);
produtosRouter.delete('/:id', validateParams(produtoParamsDto), asyncHandler(produtosController.deactivate));
