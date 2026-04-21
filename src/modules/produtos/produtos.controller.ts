import type { Request, Response } from 'express';
import { produtosService } from './produtos.service';
import { getStringParam } from '../../utils/request-params';

export const produtosController = {
  async create(req: Request, res: Response) {
    const produto = await produtosService.create(req.body);
    res.status(201).json({ success: true, data: produto });
  },

  async list(_req: Request, res: Response) {
    const produtos = await produtosService.list();
    res.status(200).json({ success: true, data: produtos });
  },

  async getById(req: Request, res: Response) {
    const id = getStringParam(req.params.id, 'id');
    const produto = await produtosService.getById(id);
    if (!produto) {
      res.status(404).json({ success: false, message: 'Produto nao encontrado' });
      return;
    }
    res.status(200).json({ success: true, data: produto });
  },

  async update(req: Request, res: Response) {
    const id = getStringParam(req.params.id, 'id');
    const produto = await produtosService.update(id, req.body);
    res.status(200).json({ success: true, data: produto });
  },

  async deactivate(req: Request, res: Response) {
    const id = getStringParam(req.params.id, 'id');
    const produto = await produtosService.deactivate(id);
    res.status(200).json({ success: true, data: produto });
  },
};
