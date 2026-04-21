import type { Request, Response } from 'express';
import { fornecedoresService } from './fornecedores.service';
import { getStringParam } from '../../utils/request-params';

export const fornecedoresController = {
  async create(req: Request, res: Response) {
    const fornecedor = await fornecedoresService.create(req.body);
    res.status(201).json({ success: true, data: fornecedor });
  },

  async list(_req: Request, res: Response) {
    const fornecedores = await fornecedoresService.list();
    res.status(200).json({ success: true, data: fornecedores });
  },

  async getById(req: Request, res: Response) {
    const id = getStringParam(req.params.id, 'id');
    const fornecedor = await fornecedoresService.getById(id);
    if (!fornecedor) {
      res.status(404).json({ success: false, message: 'Fornecedor nao encontrado' });
      return;
    }
    res.status(200).json({ success: true, data: fornecedor });
  },

  async update(req: Request, res: Response) {
    const id = getStringParam(req.params.id, 'id');
    const fornecedor = await fornecedoresService.update(id, req.body);
    res.status(200).json({ success: true, data: fornecedor });
  },

  async deactivate(req: Request, res: Response) {
    const id = getStringParam(req.params.id, 'id');
    const fornecedor = await fornecedoresService.deactivate(id);
    res.status(200).json({ success: true, data: fornecedor });
  },
};
