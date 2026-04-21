import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler';
import { fornecedoresController } from './fornecedores.controller';

export const fornecedoresRouter = Router();

fornecedoresRouter.post('/', asyncHandler(fornecedoresController.create));
fornecedoresRouter.get('/', asyncHandler(fornecedoresController.list));
fornecedoresRouter.get('/:id', asyncHandler(fornecedoresController.getById));
fornecedoresRouter.patch('/:id', asyncHandler(fornecedoresController.update));
fornecedoresRouter.delete('/:id', asyncHandler(fornecedoresController.deactivate));
